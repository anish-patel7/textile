require('dotenv').config({ path: './backend/.env' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
const BUCKET = 'designs';
const uploadsDir = path.join(__dirname, 'backend', 'uploads');

// picsum seeds for each design (fallback if local file missing)
const imageSeeds = {
  'D-001': '1019', 'D-002': '1060', 'D-003': '1048', 'D-004': '1059', 'D-005': '1074',
  'D-006': '110',  'D-007': '1047', 'D-008': '152',  'D-009': '1053', 'D-010': '117',
  'D-011': '137',  'D-012': '145',  'D-013': '160',  'D-014': '176',  'D-015': '180',
};

function download(url) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    function get(u) {
      const proto = u.startsWith('https') ? https : http;
      proto.get(u, res => {
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

async function ensureBucket() {
  const { data: buckets } = await supabase.storage.listBuckets();
  if (!buckets?.find(b => b.name === BUCKET)) {
    const { error } = await supabase.storage.createBucket(BUCKET, { public: true });
    if (error) throw error;
    console.log(`✅ Created Supabase Storage bucket: "${BUCKET}"`);
  } else {
    console.log(`📦 Bucket "${BUCKET}" already exists`);
  }
}

async function migrate() {
  console.log('🚀 Migrating images to Supabase Storage...\n');

  await ensureBucket();

  const { data: designs, error } = await supabase
    .from('designs')
    .select('id, design_number, image_path');

  if (error) { console.error('❌ Failed to fetch designs:', error.message); return; }

  for (const design of designs) {
    const dn = design.design_number;

    // Skip if already pointing to Supabase Storage
    if (design.image_path && design.image_path.startsWith('https://')) {
      console.log(`⏭  ${dn} already uses cloud URL — skipping`);
      continue;
    }

    const filename = `design_${dn.replace('-', '')}.jpg`;
    let buffer;

    // Try local file first
    const localPath = path.join(uploadsDir, filename);
    if (fs.existsSync(localPath)) {
      buffer = fs.readFileSync(localPath);
      process.stdout.write(`📁 ${dn} (local) → uploading... `);
    } else if (imageSeeds[dn]) {
      // Download from picsum as fallback
      process.stdout.write(`⬇️  ${dn} (picsum) → downloading... `);
      try {
        buffer = await download(`https://picsum.photos/seed/${imageSeeds[dn]}/640/640`);
      } catch (e) {
        console.log(`❌ Download failed: ${e.message}`);
        continue;
      }
    } else {
      console.log(`⚠️  ${dn} — no local file and no picsum seed, skipping`);
      continue;
    }

    // Upload to Supabase Storage (overwrite if exists)
    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(filename, buffer, { contentType: 'image/jpeg', upsert: true });

    if (upErr) { console.log(`❌ Upload failed: ${upErr.message}`); continue; }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(filename);

    // Update database
    const { error: dbErr } = await supabase
      .from('designs')
      .update({ image_path: publicUrl })
      .eq('id', design.id);

    if (dbErr) { console.log(`❌ DB update failed: ${dbErr.message}`); continue; }

    console.log(`✅ Done`);
  }

  console.log('\n=============================');
  console.log('🎉 Migration complete!');
  console.log('Images are now in Supabase Storage and will');
  console.log('persist across Railway/Vercel deployments.');
  console.log('=============================');
}

migrate().catch(err => { console.error('❌ Fatal:', err.message); process.exit(1); });
