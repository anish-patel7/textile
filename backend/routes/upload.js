const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const supabase = require('../supabase');

const BUCKET = 'designs';
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error('Only JPG, PNG, JPEG, WEBP files are allowed'));
  },
  limits: { fileSize: 20 * 1024 * 1024 },
});

async function ensureBucket() {
  const { data: buckets } = await supabase.storage.listBuckets();
  if (!buckets?.find(b => b.name === BUCKET)) {
    await supabase.storage.createBucket(BUCKET, { public: true });
  }
}

// POST upload image
router.post('/', upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  try {
    await ensureBucket();
    const ext = path.extname(req.file.originalname).toLowerCase();
    const filename = `design_${Date.now()}${ext}`;
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(filename, req.file.buffer, { contentType: req.file.mimetype, upsert: false });
    if (error) throw error;
    const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(filename);
    res.json({ filename, path: publicUrl, url: publicUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE image
router.delete('/:filename', async (req, res) => {
  try {
    const { error } = await supabase.storage.from(BUCKET).remove([req.params.filename]);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
