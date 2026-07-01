import React, { useEffect, useState, useRef } from 'react';
import { useApp } from '../App';
import { getDesign, createDesign, updateDesign, uploadImage } from '../lib/api';

const FIELD_GROUPS = [
  [['design_number', 'Design Number *'], ['design_name', 'Design Name']],
  [['dn', 'DN'], ['dn_code', 'DN Code']],
  [['reed', 'Reed'], ['pick', 'Pick'], ['cards', 'Cards']],
  [['patti', 'Patti'], ['total_dc', 'Total D.C.'], ['total_cut', 'Total Cut']],
  [['work', 'Work'], ['blue_apt', 'Blue + APT']],
];

export default function DesignForm() {
  const { editId, navigate, showToast } = useApp();
  const isEdit = !!editId;
  const [form, setForm] = useState({ design_number: '', design_name: '', dn: '', dn_code: '', reed: '', pick: '', cards: '', patti: '', total_dc: '', total_cut: '', work: '', blue_apt: '', description: '', remarks: '', image_path: '' });
  const [feeders, setFeeders] = useState([{ feeder_number: 1, color_name: '', old_number: '' }]);
  const [saving, setSaving] = useState(false);
  const [dupError, setDupError] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();
  const draftTimer = useRef();

  useEffect(() => {
    if (isEdit) {
      getDesign(editId).then(d => {
        setForm({ design_number: d.design_number || '', design_name: d.design_name || '', dn: d.dn || '', dn_code: d.dn_code || '', reed: d.reed || '', pick: d.pick || '', cards: d.cards || '', patti: d.patti || '', total_dc: d.total_dc || '', total_cut: d.total_cut || '', work: d.work || '', blue_apt: d.blue_apt || '', description: d.description || '', remarks: d.remarks || '', image_path: d.image_path || '' });
        setFeeders(d.feeders && d.feeders.length > 0 ? d.feeders.sort((a, b) => a.feeder_number - b.feeder_number) : [{ feeder_number: 1, color_name: '', old_number: '' }]);
        if (d.image_path) setImagePreview(`http://localhost:5000${d.image_path}`);
      });
    }

    // Auto-save draft every 60s
    draftTimer.current = setInterval(() => {
      localStorage.setItem('draft', JSON.stringify({ form, feeders }));
    }, 60000);
    return () => clearInterval(draftTimer.current);
  }, [editId]);

  function set(key, val) { setForm(f => ({ ...f, [key]: val })); setDupError(''); }

  function addFeeder() {
    setFeeders(ff => [...ff, { feeder_number: ff.length + 1, color_name: '', old_number: '' }]);
  }

  function removeFeeder(idx) { setFeeders(ff => ff.filter((_, i) => i !== idx).map((f, i) => ({ ...f, feeder_number: i + 1 }))); }

  function setFeeder(idx, key, val) { setFeeders(ff => ff.map((f, i) => i === idx ? { ...f, [key]: val } : f)); }

  function moveFeeder(idx, dir) {
    setFeeders(ff => {
      const arr = [...ff];
      const to = idx + dir;
      if (to < 0 || to >= arr.length) return arr;
      [arr[idx], arr[to]] = [arr[to], arr[idx]];
      return arr.map((f, i) => ({ ...f, feeder_number: i + 1 }));
    });
  }

  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const result = await uploadImage(file);
      set('image_path', result.path);
      setImagePreview(result.url);
      showToast('Image uploaded');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    if (!form.design_number.trim()) { setDupError('Design number is required'); return; }
    setSaving(true);
    setDupError('');
    try {
      const payload = { ...form, feeders };
      if (isEdit) await updateDesign(editId, payload);
      else await createDesign(payload);
      localStorage.removeItem('draft');
      showToast(isEdit ? 'Design updated' : 'Design saved');
      navigate('designs');
    } catch (e) {
      if (e.message.includes('already exists')) setDupError(e.message);
      else showToast(e.message, 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fade-in" style={{ padding: '22px 28px', maxWidth: 1080 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button onClick={() => navigate('designs')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, border: 'none', background: 'none', color: 'var(--text-muted)', font: 'inherit', fontSize: 13, fontWeight: 500, cursor: 'pointer', padding: 0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>Cancel
        </button>
        <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-.3px' }}>{isEdit ? 'Edit Design' : 'New Design'}</div>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: 'var(--success)', fontSize: 11.5, fontWeight: 600 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>Auto-save on
        </span>
        <div style={{ flex: 1 }} />
        <button className="btn-ghost" onClick={() => navigate('designs')}>Discard</button>
        <button className="btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : 'Save Design'}
        </button>
      </div>

      {dupError && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, background: 'var(--danger-soft)', color: 'var(--danger)', borderRadius: 10, padding: '11px 15px', marginBottom: 16, fontSize: 13, fontWeight: 600 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/><path d="M12 7v6M12 16.5v.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
          {dupError}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 22, alignItems: 'start' }}>
        {/* Main fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {FIELD_GROUPS.map((group, gi) => (
            <div key={gi} style={{ display: 'grid', gridTemplateColumns: `repeat(${group.length},1fr)`, gap: 14 }}>
              {group.map(([key, label]) => (
                <div key={key}>
                  <label className="label">{label}</label>
                  <input className="input" value={form[key]} onChange={e => set(key, e.target.value)} placeholder={label.replace(' *', '')} />
                </div>
              ))}
            </div>
          ))}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label className="label">Description</label>
              <textarea className="textarea" rows={3} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Optional description…" />
            </div>
            <div>
              <label className="label">Remarks</label>
              <textarea className="textarea" rows={3} value={form.remarks} onChange={e => set('remarks', e.target.value)} placeholder="Optional remarks…" />
            </div>
          </div>

          {/* Feeders */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-muted)', letterSpacing: '.3px' }}>FEEDER DETAILS ({feeders.length})</div>
              <button className="btn-primary" style={{ height: 36, padding: '0 14px', fontSize: 12.5 }} onClick={addFeeder}>+ Add Feeder</button>
            </div>

            <div className="card" style={{ overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr 1fr 90px', padding: '10px 16px', background: 'var(--bg-subtle)', borderBottom: '1px solid var(--border)', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '.4px' }}>
                <span>FEEDER #</span><span>COLOR NAME</span><span>OLD NUMBER</span><span>ACTIONS</span>
              </div>
              {feeders.map((f, idx) => (
                <div key={idx} style={{ display: 'grid', gridTemplateColumns: '70px 1fr 1fr 90px', padding: '10px 16px', borderBottom: '1px solid var(--border)', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontWeight: 600, fontSize: 13 }}>{f.feeder_number}</span>
                  <input className="input" style={{ height: 36 }} value={f.color_name} onChange={e => setFeeder(idx, 'color_name', e.target.value)} placeholder="e.g. Ground, Black" />
                  <input className="input" style={{ height: 36 }} value={f.old_number} onChange={e => setFeeder(idx, 'old_number', e.target.value)} placeholder="e.g. 5831" />
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button onClick={() => moveFeeder(idx, -1)} disabled={idx === 0} title="Move up" style={{ width: 26, height: 26, border: '1px solid var(--border)', borderRadius: 6, background: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>↑</button>
                    <button onClick={() => moveFeeder(idx, 1)} disabled={idx === feeders.length - 1} title="Move down" style={{ width: 26, height: 26, border: '1px solid var(--border)', borderRadius: 6, background: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>↓</button>
                    <button onClick={() => removeFeeder(idx)} title="Delete" style={{ width: 26, height: 26, border: '1px solid var(--border)', borderRadius: 6, background: 'none', cursor: 'pointer', color: 'var(--danger)', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Image upload */}
        <div>
          <label className="label">Design Image</label>
          <div style={{ border: '2px dashed var(--border)', borderRadius: 14, overflow: 'hidden', aspectRatio: '1', background: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 10, cursor: 'pointer', transition: 'border-color .15s' }}
            onClick={() => fileRef.current.click()}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="var(--text-faint)" strokeWidth="1.3"/><circle cx="8.5" cy="8.5" r="1.5" stroke="var(--text-faint)" strokeWidth="1.3"/><path d="M21 15l-5-5L5 21" stroke="var(--text-faint)" strokeWidth="1.3" strokeLinejoin="round"/></svg>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--text-muted)' }}>{uploading ? 'Uploading…' : 'Click to upload'}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-faint)', marginTop: 3 }}>JPG, PNG, WEBP up to 20MB</div>
                </div>
              </>
            )}
          </div>
          <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.webp" style={{ display: 'none' }} onChange={handleImageUpload} />
          {imagePreview && (
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <button className="btn-ghost" style={{ flex: 1, justifyContent: 'center', height: 36, fontSize: 12.5 }} onClick={() => fileRef.current.click()}>Replace Image</button>
              <button style={{ flex: 1, height: 36, border: '1px solid var(--border)', borderRadius: 9, background: 'none', color: 'var(--danger)', font: 'inherit', fontWeight: 600, fontSize: 12.5, cursor: 'pointer' }} onClick={() => { setImagePreview(''); set('image_path', ''); }}>Remove</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
