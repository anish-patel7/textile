const express = require('express');
const router = express.Router();
const supabase = require('../supabase');
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');

const backupDir = path.join(__dirname, '..', '..', 'Backup');
const uploadsDir = path.join(__dirname, '..', 'uploads');

// GET backup status
router.get('/status', (req, res) => {
  try {
    if (!fs.existsSync(backupDir)) return res.json({ backups: [], count: 0 });
    const dirs = fs.readdirSync(backupDir)
      .filter(n => n.startsWith('backup_'))
      .sort()
      .reverse();
    const backups = dirs.map(d => {
      try {
        const info = JSON.parse(fs.readFileSync(path.join(backupDir, d, 'backup_info.json'), 'utf8'));
        return info;
      } catch {
        return { name: d };
      }
    });
    res.json({ backups, count: backups.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create backup
router.post('/', async (req, res) => {
  try {
    if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });

    const ts = new Date();
    const label = ts.toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const backupName = `backup_${label}`;
    const backupPath = path.join(backupDir, backupName);
    fs.mkdirSync(backupPath);

    // Export all data from Supabase
    const [{ data: designs }, { data: feeders }, { data: settings }] = await Promise.all([
      supabase.from('designs').select('*'),
      supabase.from('feeders').select('*'),
      supabase.from('settings').select('*'),
    ]);

    fs.writeFileSync(path.join(backupPath, 'designs.json'), JSON.stringify(designs || [], null, 2));
    fs.writeFileSync(path.join(backupPath, 'feeders.json'), JSON.stringify(feeders || [], null, 2));
    fs.writeFileSync(path.join(backupPath, 'settings.json'), JSON.stringify(settings || [], null, 2));

    // Copy uploads
    const backupUploads = path.join(backupPath, 'uploads');
    fs.mkdirSync(backupUploads);
    if (fs.existsSync(uploadsDir)) {
      fs.readdirSync(uploadsDir).forEach(file => {
        fs.copyFileSync(path.join(uploadsDir, file), path.join(backupUploads, file));
      });
    }

    const info = {
      name: backupName,
      date: ts.toLocaleDateString('en-IN'),
      time: ts.toLocaleTimeString('en-IN'),
      timestamp: ts.toISOString(),
      designCount: (designs || []).length,
      feederCount: (feeders || []).length,
      version: '1.0.0',
    };
    fs.writeFileSync(path.join(backupPath, 'backup_info.json'), JSON.stringify(info, null, 2));

    // Keep only latest 10 backups
    const allBackups = fs.readdirSync(backupDir).filter(n => n.startsWith('backup_')).sort();
    while (allBackups.length > 10) {
      const oldest = allBackups.shift();
      fs.rmSync(path.join(backupDir, oldest), { recursive: true, force: true });
    }

    res.json({ success: true, backup: info });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST restore from backup name
router.post('/restore/:name', async (req, res) => {
  try {
    const backupPath = path.join(backupDir, req.params.name);
    if (!fs.existsSync(backupPath)) return res.status(404).json({ error: 'Backup not found' });

    const designs = JSON.parse(fs.readFileSync(path.join(backupPath, 'designs.json'), 'utf8'));
    const feeders = JSON.parse(fs.readFileSync(path.join(backupPath, 'feeders.json'), 'utf8'));
    const settings = JSON.parse(fs.readFileSync(path.join(backupPath, 'settings.json'), 'utf8'));

    // Clear and restore
    await supabase.from('feeders').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('designs').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (designs.length) await supabase.from('designs').insert(designs);
    if (feeders.length) await supabase.from('feeders').insert(feeders);
    if (settings.length) await supabase.from('settings').upsert(settings, { onConflict: 'key' });

    // Restore uploads
    const backupUploads = path.join(backupPath, 'uploads');
    if (fs.existsSync(backupUploads)) {
      if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
      fs.readdirSync(backupUploads).forEach(file => {
        fs.copyFileSync(path.join(backupUploads, file), path.join(uploadsDir, file));
      });
    }

    res.json({ success: true, restored: req.params.name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE backup
router.delete('/:name', (req, res) => {
  try {
    const backupPath = path.join(backupDir, req.params.name);
    if (fs.existsSync(backupPath)) {
      fs.rmSync(backupPath, { recursive: true, force: true });
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Backup not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
