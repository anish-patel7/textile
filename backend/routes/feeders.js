const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

// Search feeders by color or old number (for cross-design search)
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);
    const { data, error } = await supabase
      .from('feeders')
      .select('*, designs(design_number, design_name)')
      .or(`color_name.ilike.%${q}%,old_number.ilike.%${q}%`)
      .limit(50);
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
