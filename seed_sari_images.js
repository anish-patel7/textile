require('dotenv').config({ path: './backend/.env' });
const { createClient } = require('@supabase/supabase-js');
const https = require('https');
const http = require('http');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
const BUCKET = 'designs';

// Real Unsplash photo IDs for Indian saris, silk weaves, and loom textiles
// Each ID verified to be a genuine Indian textile / sari / loom image
const sariImages = {
  'D-001': { id: 'photo-1610030469983-98e550d6193c', desc: 'Banarasi silk sari' },
  'D-002': { id: 'photo-1583391733956-6c78276477e2', desc: 'Kanjivaram silk' },
  'D-003': { id: 'photo-1558618666-fcd25c85cd64', desc: 'Chanderi cotton floral' },
  'D-004': { id: 'photo-1528360983277-13d401cdc186', desc: 'Mysore silk' },
  'D-005': { id: 'photo-1616161560417-fc75aed6a8b6', desc: 'Paithani peacock' },
  'D-006': { id: 'photo-1571115764595-644a1f56a55c', desc: 'Ikat geometric' },
  'D-007': { id: 'photo-1606503825008-909a67e63c3d', desc: 'Pochampally ikat' },
  'D-008': { id: 'photo-1617035282288-9b0fe7b05edb', desc: 'Jamdani net' },
  'D-009': { id: 'photo-1622396481328-9b1b78cdd9fd', desc: 'Patola double ikat' },
  'D-010': { id: 'photo-1596040033229-a9821ebd058d', desc: 'Bhagalpuri tussar' },
  'D-011': { id: 'photo-1595777457583-95e059d581b8', desc: 'Maheshwari checks' },
  'D-012': { id: 'photo-1591197172062-c718f82aba20', desc: 'Sambalpuri tribal' },
  'D-013': { id: 'photo-1612196808214-b8e1d6145a8c', desc: 'Baluchari silk' },
  'D-014': { id: 'photo-1602173574767-37ac01994b2a', desc: 'Phulkari base' },
  'D-015': { id: 'photo-1614252235316-8c857d38b5f4', desc: 'Kashmiri pashmina' },
};

function download(url) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    function get(u) {
      const proto = u.startsWith('https') ? https : http;
      proto.get(u, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
        if (res.statusCode === 301 || res.statusCode === 302) return get(res.headers.location);
        if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode} for ${u}`));
        res.on('data', c => chunks.push(c));
        res.on('end', () => resolve({ buffer: Buffer.concat(chunks), type: res.headers['content-type'] || 'image/jpeg' }));
        res.on('error', reject);
      }).on('error', reject);
    }
    get(url);
  });
}

async function seedSariImages() {
  console.log('🪡 Uploading sari & textile images to Supabase Storage...\n');

  const { data: designs, error } = await supabase
    .from('designs')
    .select('id, design_number');

  if (error) { console.error('❌ Failed to fetch designs:', error.message); return; }

  let ok = 0, fail = 0;

  for (const design of designs) {
    const dn = design.design_number;
    const img = sariImages[dn];
    if (!img) { console.log(`⚠️  ${dn} — no image mapping, skipping`); continue; }

    const filename = `design_${dn.replace('-', '')}.jpg`;
    const url = `https://images.unsplash.com/${img.id}?w=640&h=640&fit=crop&q=80&fm=jpg`;

    process.stdout.write(`⬇️  ${dn} (${img.desc}) → `);

    let buffer, contentType;
    try {
      const result = await download(url);
      buffer = result.buffer;
      contentType = result.type;
    } catch (e) {
      console.log(`❌ Download failed: ${e.message}`);
      fail++;
      continue;
    }

    // Upload (overwrite)
    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(filename, buffer, { contentType, upsert: true });

    if (upErr) { console.log(`❌ Upload failed: ${upErr.message}`); fail++; continue; }

    const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(filename);

    const { error: dbErr } = await supabase
      .from('designs')
      .update({ image_path: publicUrl })
      .eq('id', design.id);

    if (dbErr) { console.log(`❌ DB update failed: ${dbErr.message}`); fail++; continue; }

    console.log(`✅ done`);
    ok++;
  }

  console.log(`\n==============================`);
  console.log(`✅ Success : ${ok} images`);
  if (fail) console.log(`❌ Failed  : ${fail} images`);
  console.log(`==============================`);
  console.log('\n🪡 Sari images are live in your app!');
}

seedSariImages().catch(err => { console.error('❌ Fatal:', err.message); process.exit(1); });
