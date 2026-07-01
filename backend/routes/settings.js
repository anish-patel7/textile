const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

// GET all settings
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase.from('settings').select('*');
    if (error) throw error;
    const settings = {};
    (data || []).forEach(row => { settings[row.key] = row.value; });
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update settings (upsert all)
router.put('/', async (req, res) => {
  try {
    const entries = Object.entries(req.body).map(([key, value]) => ({ key, value: String(value) }));
    const { error } = await supabase.from('settings').upsert(entries, { onConflict: 'key' });
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
