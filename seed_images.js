require('dotenv').config({ path: './backend/.env' });
const { createClient } = require('@supabase/supabase-js');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
const uploadsDir = path.join(__dirname, 'backend', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// Picsum photo IDs that look like fabric/textile/pattern
const imageSeeds = {
  'D-001': '1019',  // warm red/gold
  'D-002': '1060',  // rich fabric
  'D-003': '1048',  // floral
  'D-004': '1059',  // silk like
  'D-005': '1074',  // colorful
  'D-006': '110',   // geometric
  'D-007': '1047',  // pattern
  'D-008': '152',   // fine net
  'D-009': '1053',  // vibrant
  'D-010': '117',   // natural/brown
  'D-011': '137',   // checks
  'D-012': '145',   // tribal
  'D-013': '160',   // classic
  'D-014': '176',   // embroidery
  'D-015': '180',   // white/pashmina
};

function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const protocol = url.startsWith('https') ? https : http;

    function get(url) {
      protocol.get(url, res => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          get(res.headers.location); // follow redirect
          return;
        }
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode}`));
          return;
        }
        res.pipe(file);
        file.on('finish', () => { file.close(); resolve(); });
      }).on('error', reject);
    }

    get(url);
  });
}

async function seedImages() {
  console.log('🖼  Downloading & pushing images to Supabase...\n');

  const { data: designs, error } = await supabase
    .from('designs')
    .select('id, design_number');

  if (error) { console.error('❌ Failed to fetch designs:', error.message); return; }

  for (const design of designs) {
    const seed = imageSeeds[design.design_number];
    if (!seed) continue;

    const filename = `design_${design.design_number.replace('-', '')}.jpg`;
    const filepath = path.join(uploadsDir, filename);
    const imagePath = `/uploads/${filename}`;
    const url = `https://picsum.photos/seed/${seed}/640/640`;

    try {
      // Download image
      process.stdout.write(`⬇️  Downloading ${design.design_number}... `);
      await downloadImage(url, filepath);

      // Update Supabase
      const { error: updateErr } = await supabase
        .from('designs')
        .update({ image_path: imagePath })
        .eq('id', design.id);

      if (updateErr) throw updateErr;

      console.log(`✅ Done — ${filename}`);
    } catch (err) {
      console.log(`❌ Failed — ${err.message}`);
    }
  }

  console.log('\n=============================');
  console.log('🎉 All images pushed!');
  console.log('=============================');
  console.log('\nImages saved to: backend/uploads/');
  console.log('Supabase image_path updated for all designs.');
}

seedImages();
