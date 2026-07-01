const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

// GET all designs (with optional search)
router.get('/', async (req, res) => {
  try {
    const { search, limit = 100, offset = 0 } = req.query;
    let query = supabase
      .from('designs')
      .select('*, feeders(*)')
      .order('created_date', { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (search && search.trim()) {
      const s = search.trim();
      query = query.or(
        `design_number.ilike.%${s}%,design_name.ilike.%${s}%,dn.ilike.%${s}%,dn_code.ilike.%${s}%,reed.ilike.%${s}%,pick.ilike.%${s}%,cards.ilike.%${s}%,work.ilike.%${s}%`
      );
    }

    const { data, error, count } = await query;
    if (error) throw error;
    res.json({ designs: data, total: count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET stats for dashboard
router.get('/stats', async (req, res) => {
  try {
    const [designsResult, feedersResult] = await Promise.all([
      supabase.from('designs').select('*', { count: 'exact', head: true }),
      supabase.from('feeders').select('*', { count: 'exact', head: true }),
    ]);

    const { count: designCount } = designsResult;
    const { count: feederCount } = feedersResult;

    // Count designs with images
    const { count: imageCount } = await supabase
      .from('designs')
      .select('*', { count: 'exact', head: true })
      .not('image_path', 'is', null);

    // Recent 6
    const { data: recent } = await supabase
      .from('designs')
      .select('id, design_number, design_name, work, image_path, feeders(*)')
      .order('created_date', { ascending: false })
      .limit(6);

    // Work distribution
    const { data: workData } = await supabase
      .from('designs')
      .select('work');

    const workDist = {};
    (workData || []).forEach(d => {
      if (d.work) workDist[d.work] = (workDist[d.work] || 0) + 1;
    });

    res.json({
      designCount: designCount || 0,
      feederCount: feederCount || 0,
      imageCount: imageCount || 0,
      recent: recent || [],
      workDist,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single design
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('designs')
      .select('*, feeders(*)')
      .eq('id', req.params.id)
      .single();
    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Design not found' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create design
router.post('/', async (req, res) => {
  try {
    const {
      design_number, design_name, dn, dn_code, reed, pick, cards,
      patti, total_dc, total_cut, work, blue_apt, description, remarks,
      image_path, feeders = []
    } = req.body;

    if (!design_number) return res.status(400).json({ error: 'Design number is required' });

    // Check duplicate
    const { data: existing } = await supabase
      .from('designs')
      .select('id')
      .eq('design_number', design_number)
      .single();
    if (existing) return res.status(409).json({ error: `Design number "${design_number}" already exists` });

    const now = new Date().toISOString();
    const { data: design, error } = await supabase
      .from('designs')
      .insert({
        design_number, design_name, dn, dn_code, reed, pick, cards,
        patti, total_dc, total_cut, work, blue_apt, description, remarks,
        image_path, created_date: now, updated_date: now
      })
      .select()
      .single();
    if (error) throw error;

    // Insert feeders
    if (feeders.length > 0) {
      const feederRows = feeders.map((f, i) => ({
        design_id: design.id,
        feeder_number: f.feeder_number || i + 1,
        color_name: f.color_name || '',
        old_number: f.old_number || '',
      }));
      const { error: fErr } = await supabase.from('feeders').insert(feederRows);
      if (fErr) throw fErr;
    }

    res.status(201).json(design);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update design
router.put('/:id', async (req, res) => {
  try {
    const {
      design_number, design_name, dn, dn_code, reed, pick, cards,
      patti, total_dc, total_cut, work, blue_apt, description, remarks,
      image_path, feeders = []
    } = req.body;

    const { id } = req.params;

    // Check duplicate design_number on other records
    if (design_number) {
      const { data: existing } = await supabase
        .from('designs')
        .select('id')
        .eq('design_number', design_number)
        .neq('id', id)
        .single();
      if (existing) return res.status(409).json({ error: `Design number "${design_number}" already exists` });
    }

    const { data, error } = await supabase
      .from('designs')
      .update({
        design_number, design_name, dn, dn_code, reed, pick, cards,
        patti, total_dc, total_cut, work, blue_apt, description, remarks,
        image_path, updated_date: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;

    // Replace feeders
    await supabase.from('feeders').delete().eq('design_id', id);
    if (feeders.length > 0) {
      const feederRows = feeders.map((f, i) => ({
        design_id: id,
        feeder_number: f.feeder_number || i + 1,
        color_name: f.color_name || '',
        old_number: f.old_number || '',
      }));
      await supabase.from('feeders').insert(feederRows);
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE design
router.delete('/:id', async (req, res) => {
  try {
    const { error } = await supabase.from('designs').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
