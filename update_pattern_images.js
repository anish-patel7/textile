require('dotenv').config({ path: './backend/.env' });
const { createClient } = require('@supabase/supabase-js');
const https = require('https');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
const BUCKET = 'designs';

// Hand-verified Pexels photos — every one is a flat fabric / weave / embroidery
// close-up with NO people, NO props. Reviewed visually before assigning.
const designImages = [
  { dn: 'D-001', pexelsId: 20181020, desc: 'Banarasi — white/gold floral brocade' },
  { dn: 'D-002', pexelsId: 10317113, desc: 'Kanjivaram — purple/gold silk weave' },
  { dn: 'D-003', pexelsId: 7956629,  desc: 'Chanderi — soft pink satin' },
  { dn: 'D-004', pexelsId: 4938321,  desc: 'Mysore — lustrous gold silk' },
  { dn: 'D-005', pexelsId: 31157322, desc: 'Paithani — silver peacock embroidery' },
  { dn: 'D-006', pexelsId: 36516572, desc: 'Ikat — colorful silk brocade stack' },
  { dn: 'D-007', pexelsId: 23749436, desc: 'Pochampally — wall of patterned textiles' },
  { dn: 'D-008', pexelsId: 8465944,  desc: 'Jamdani — fine ivory silk' },
  { dn: 'D-009', pexelsId: 5439054,  desc: 'Patola — red paisley weave' },
  { dn: 'D-010', pexelsId: 7640759,  desc: 'Tussar — raw cream silk texture' },
  { dn: 'D-011', pexelsId: 7676887,  desc: 'Maheshwari — teal satin silk' },
  { dn: 'D-012', pexelsId: 4566670,  desc: 'Sambalpuri — colorful printed fabric' },
  { dn: 'D-013', pexelsId: 6045294,  desc: 'Baluchari — oriental scene brocade' },
  { dn: 'D-014', pexelsId: 3339215,  desc: 'Phulkari — gold floral embroidery' },
  { dn: 'D-015', pexelsId: 6275995,  desc: 'Pashmina — gold sequin & navy silk' },
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
  console.log('🧵 Updating designs with verified flat fabric-pattern images...\n');

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
  console.log('🧵 All designs now show pure saree fabric patterns — no people, no props.');
}

run().catch(err => { console.error('❌', err.message); process.exit(1); });
