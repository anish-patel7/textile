require('dotenv').config({ path: './backend/.env' });
const { createClient } = require('@supabase/supabase-js');
const https = require('https');
const http = require('http');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
const BUCKET = 'designs';

// Only the 4 that failed — using Pexels CDN (no API key needed for direct image URLs)
const fixes = [
  { dn: 'D-002', filename: 'design_D002.jpg', desc: 'Kanjivaram gold silk',   url: 'https://images.pexels.com/photos/6311652/pexels-photo-6311652.jpeg?w=640&h=640&fit=crop' },
  { dn: 'D-005', filename: 'design_D005.jpg', desc: 'Paithani peacock weave', url: 'https://images.pexels.com/photos/3965557/pexels-photo-3965557.jpeg?w=640&h=640&fit=crop' },
  { dn: 'D-006', filename: 'design_D006.jpg', desc: 'Ikat geometric pattern', url: 'https://images.pexels.com/photos/6044266/pexels-photo-6044266.jpeg?w=640&h=640&fit=crop' },
  { dn: 'D-008', filename: 'design_D008.jpg', desc: 'Jamdani fine weave',     url: 'https://images.pexels.com/photos/3912516/pexels-photo-3912516.jpeg?w=640&h=640&fit=crop' },
];

function download(url) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    function get(u) {
      const proto = u.startsWith('https') ? https : http;
      proto.get(u, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
        if (res.statusCode === 301 || res.statusCode === 302) return get(res.headers.location);
        if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`));
        res.on('data', c => chunks.push(c));
        res.on('end', () => resolve({ buffer: Buffer.concat(chunks), type: res.headers['content-type'] || 'image/jpeg' }));
        res.on('error', reject);
      }).on('error', reject);
    }
    get(url);
  });
}

async function fixImages() {
  console.log('🔧 Fixing 4 missing sari images...\n');

  const { data: designs } = await supabase.from('designs').select('id, design_number');
  const designMap = Object.fromEntries(designs.map(d => [d.design_number, d.id]));

  for (const fix of fixes) {
    process.stdout.write(`⬇️  ${fix.dn} (${fix.desc}) → `);
    let buffer, contentType;
    try {
      const r = await download(fix.url);
      buffer = r.buffer;
      contentType = r.type;
    } catch (e) {
      console.log(`❌ Download failed: ${e.message}`);
      continue;
    }

    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(fix.filename, buffer, { contentType, upsert: true });
    if (upErr) { console.log(`❌ Upload: ${upErr.message}`); continue; }

    const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(fix.filename);

    const id = designMap[fix.dn];
    if (!id) { console.log(`❌ Design not found in DB`); continue; }

    const { error: dbErr } = await supabase
      .from('designs')
      .update({ image_path: publicUrl })
      .eq('id', id);
    if (dbErr) { console.log(`❌ DB: ${dbErr.message}`); continue; }

    console.log(`✅ done`);
  }

  console.log('\n✅ All done — all 15 sari images are now in Supabase Storage!');
}

fixImages().catch(err => { console.error('❌ Fatal:', err.message); process.exit(1); });
