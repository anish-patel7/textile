const express = require('express');
const router = express.Router();
const supabase = require('../supabase');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');

// GET designs for report (filtered)
router.get('/data', async (req, res) => {
  try {
    const { period, search } = req.query;
    let query = supabase.from('designs').select('*, feeders(*)').order('created_date', { ascending: false });

    if (period && period !== 'all') {
      const now = new Date();
      let from;
      if (period === 'today') from = new Date(now.setHours(0, 0, 0, 0));
      else if (period === 'week') { from = new Date(); from.setDate(from.getDate() - 7); }
      else if (period === 'month') { from = new Date(); from.setMonth(from.getMonth() - 1); }
      else if (period === 'year') { from = new Date(); from.setFullYear(from.getFullYear() - 1); }
      if (from) query = query.gte('created_date', from.toISOString());
    }

    if (search) {
      query = query.or(`design_number.ilike.%${search}%,design_name.ilike.%${search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET Excel report
router.get('/excel', async (req, res) => {
  try {
    const { data: designs, error } = await supabase
      .from('designs')
      .select('*, feeders(*)')
      .order('created_date', { ascending: false });
    if (error) throw error;

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Textile Design Manager';
    const sheet = workbook.addWorksheet('Designs');

    sheet.columns = [
      { header: 'Design No', key: 'design_number', width: 15 },
      { header: 'Design Name', key: 'design_name', width: 25 },
      { header: 'DN', key: 'dn', width: 12 },
      { header: 'DN Code', key: 'dn_code', width: 12 },
      { header: 'Reed', key: 'reed', width: 10 },
      { header: 'Pick', key: 'pick', width: 10 },
      { header: 'Cards', key: 'cards', width: 10 },
      { header: 'Patti', key: 'patti', width: 10 },
      { header: 'Total DC', key: 'total_dc', width: 12 },
      { header: 'Total Cut', key: 'total_cut', width: 12 },
      { header: 'Work', key: 'work', width: 20 },
      { header: 'Blue + APT', key: 'blue_apt', width: 14 },
      { header: 'Description', key: 'description', width: 30 },
      { header: 'Remarks', key: 'remarks', width: 30 },
      { header: 'Created', key: 'created_date', width: 20 },
    ];

    sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0E7C6B' } };

    designs.forEach(d => {
      sheet.addRow({
        design_number: d.design_number,
        design_name: d.design_name,
        dn: d.dn,
        dn_code: d.dn_code,
        reed: d.reed,
        pick: d.pick,
        cards: d.cards,
        patti: d.patti,
        total_dc: d.total_dc,
        total_cut: d.total_cut,
        work: d.work,
        blue_apt: d.blue_apt,
        description: d.description,
        remarks: d.remarks,
        created_date: d.created_date ? new Date(d.created_date).toLocaleDateString('en-IN') : '',
      });

      // Feeders sub-sheet info
      if (d.feeders && d.feeders.length > 0) {
        d.feeders.forEach(f => {
          sheet.addRow({
            design_number: '',
            design_name: `  ↳ Feeder ${f.feeder_number}: ${f.color_name} (${f.old_number})`,
          });
          const row = sheet.lastRow;
          row.font = { italic: true, color: { argb: 'FF736B5D' } };
        });
      }
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="textile-designs-${Date.now()}.xlsx"`);
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET PDF report
router.get('/pdf', async (req, res) => {
  try {
    const { data: designs, error } = await supabase
      .from('designs')
      .select('*, feeders(*)')
      .order('created_date', { ascending: false })
      .limit(200);
    if (error) throw error;

    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="textile-designs-${Date.now()}.pdf"`);
    doc.pipe(res);

    // Title
    doc.fontSize(20).fillColor('#0e7c6b').text('Textile Design Report', { align: 'center' });
    doc.fontSize(10).fillColor('#736b5d').text(`Generated: ${new Date().toLocaleString('en-IN')}`, { align: 'center' });
    doc.moveDown(1.5);

    designs.forEach((d, i) => {
      if (i > 0) doc.moveDown(0.5);
      doc.fontSize(12).fillColor('#1f1c17').font('Helvetica-Bold').text(`${d.design_number} — ${d.design_name || ''}`);
      doc.font('Helvetica').fontSize(9).fillColor('#736b5d');

      const fields = [
        ['DN', d.dn], ['DN Code', d.dn_code], ['Reed', d.reed], ['Pick', d.pick],
        ['Cards', d.cards], ['Patti', d.patti], ['Total DC', d.total_dc], ['Total Cut', d.total_cut],
        ['Work', d.work], ['Blue + APT', d.blue_apt],
      ].filter(([, v]) => v);

      const line = fields.map(([k, v]) => `${k}: ${v}`).join('  ·  ');
      if (line) doc.text(line, { indent: 12 });

      if (d.description) doc.text(`Description: ${d.description}`, { indent: 12 });
      if (d.remarks) doc.text(`Remarks: ${d.remarks}`, { indent: 12 });

      if (d.feeders && d.feeders.length > 0) {
        doc.fillColor('#0e7c6b').text('Feeders:', { indent: 12 });
        d.feeders.sort((a, b) => a.feeder_number - b.feeder_number).forEach(f => {
          doc.fillColor('#1f1c17').text(`  Feeder ${f.feeder_number}: ${f.color_name} — ${f.old_number}`, { indent: 20 });
        });
      }

      doc.moveTo(40, doc.y + 6).lineTo(555, doc.y + 6).stroke('#e6decf').moveDown(0.5);
    });

    doc.end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
