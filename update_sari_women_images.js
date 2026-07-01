require('dotenv').config({ path: './backend/.env' });
const { createClient } = require('@supabase/supabase-js');
const https = require('https');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
const BUCKET = 'designs';

// Real Pexels photos of traditional Indian saree fabric patterns & designs
// Sourced from pexels.com/search/saree+fabric+pattern and silk+saree+texture
const designImages = [
  { dn: 'D-001', pexelsId: 35007881,  desc: 'Banarasi silk brocade fabric design' },
  { dn: 'D-002', pexelsId: 10317113,  desc: 'Kanjivaram silk weave close-up' },
  { dn: 'D-003', pexelsId: 33433875,  desc: 'Chanderi cotton floral fabric' },
  { dn: 'D-004', pexelsId: 5439054,   desc: 'Mysore silk saree design' },
  { dn: 'D-005', pexelsId: 5447529,   desc: 'Paithani silk pattern detail' },
  { dn: 'D-006', pexelsId: 8710793,   desc: 'Ikat geometric weave pattern' },
  { dn: 'D-007', pexelsId: 10317106,  desc: 'Pochampally ikat fabric detail' },
  { dn: 'D-008', pexelsId: 27918892,  desc: 'Jamdani fine weave motif' },
  { dn: 'D-009', pexelsId: 35059564,  desc: 'Patola double ikat pattern' },
  { dn: 'D-010', pexelsId: 7920199,   desc: 'Bhagalpuri tussar silk texture' },
  { dn: 'D-011', pexelsId: 8751525,   desc: 'Maheshwari checks weave' },
  { dn: 'D-012', pexelsId: 8229223,   desc: 'Sambalpuri tribal saree design' },
  { dn: 'D-013', pexelsId: 35399688,  desc: 'Baluchari brocade silk motif' },
  { dn: 'D-014', pexelsId: 33306338,  desc: 'Phulkari embroidery base fabric' },
  { dn: 'D-015', pexelsId: 8886933,   desc: 'Kashmiri pashmina fine weave' },
];

function download(id) {
  const url = `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop&dpr=1`;
  return new Promise((resolve, reject) => {
    const chunks = [];
    function get(u) {
      https.get(u, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
        if (res.statusCode === 301 || res.statusCode === 302) return get(res.headers.location);
        if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`));
        res.on('data', c => chunks.push(c));
        res.on('end', () => resolve(Buffer.concat(chunks)));
        res.on('error', reject);
      }).on('error', reject);
    }
    get(url);
  });
}

async function run() {
  console.log('🥻 Updating with traditional saree fabric design images...\n');

  const { data: designs } = await supabase.from('designs').select('id, design_number');
  const designMap = Object.fromEntries(designs.map(d => [d.design_number, d.id]));

  let ok = 0, fail = 0;
  for (const item of designImages) {
    process.stdout.write(`⬇️  ${item.dn} — ${item.desc}\n   → `);

    let buffer;
    try { buffer = await download(item.pexelsId); }
    catch (e) { console.log(`❌ Download: ${e.message}`); fail++; continue; }

    const filename = `design_${item.dn.replace('-', '')}.jpg`;
    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(filename, buffer, { contentType: 'image/jpeg', upsert: true });
    if (upErr) { console.log(`❌ Upload: ${upErr.message}`); fail++; continue; }

    const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(filename);

    const { error: dbErr } = await supabase
      .from('designs')
      .update({ image_path: publicUrl })
      .eq('id', designMap[item.dn]);
    if (dbErr) { console.log(`❌ DB: ${dbErr.message}`); fail++; continue; }

    console.log(`✅ done`);
    ok++;
  }

  console.log(`\n==============================`);
  console.log(`✅ Updated : ${ok} designs`);
  if (fail) console.log(`❌ Failed  : ${fail}`);
  console.log(`==============================`);
  console.log('🥻 App now shows traditional saree fabric design images!');
}

run().catch(err => { console.error('❌', err.message); process.exit(1); });
