require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve uploaded images statically
app.use('/uploads', express.static(uploadsDir));

// Routes
app.use('/api/designs', require('./routes/designs'));
app.use('/api/feeders', require('./routes/feeders'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/backup', require('./routes/backup'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/settings', require('./routes/settings'));

// Health check
app.get('/api/health', async (req, res) => {
  try {
    const supabase = require('./supabase');
    const { data, error } = await supabase.from('designs').select('count', { count: 'exact', head: true });
    if (error) throw error;
    res.json({ status: 'ok', database: 'connected' });
  } catch (err) {
    res.json({ status: 'ok', database: 'error: ' + err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Textile Backend running on http://localhost:${PORT}`);
});
