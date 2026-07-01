import React, { useEffect, useState } from 'react';
import { useApp } from '../App';
import { getDesign, deleteDesign } from '../lib/api';

const COLOR_MAP = { Ground: '#8B7355', Black: '#1a1a1a', White: '#f5f0e8', Red: '#c0392b', Blue: '#2980b9', Green: '#27ae60', Yellow: '#f1c40f', Orange: '#e67e22', Purple: '#8e44ad', Grey: '#95a5a6', Brown: '#6d4c41', Pink: '#e91e63' };
function colorHex(name) { if (!name) return '#ccc'; for (const [k, v] of Object.entries(COLOR_MAP)) { if (name.toLowerCase().includes(k.toLowerCase())) return v; } return '#0e7c6b'; }

export default function DesignDetail() {
  const { selectedId, navigate, openEdit, showToast } = useApp();
  const [design, setDesign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (!selectedId) return;
    setLoading(true);
    getDesign(selectedId).then(d => { setDesign(d); setLoading(false); }).catch(() => setLoading(false));
  }, [selectedId]);

  async function handleDelete() {
    try {
      await deleteDesign(selectedId);
      showToast('Design deleted');
      navigate('designs');
    } catch (e) {
      showToast(e.message, 'error');
    }
  }

  function handleWhatsApp() {
    if (!design) return;
    const feedersText = (design.feeders || []).sort((a, b) => a.feeder_number - b.feeder_number)
      .map(f => `Feeder ${f.feeder_number}: ${f.color_name} (${f.old_number})`).join('\n');
    const msg = `----------------------------------\n*Textile Design Information*\n----------------------------------\nDesign No: ${design.design_number}\nName: ${design.design_name || ''}\nDN: ${design.dn || ''}\nDN Code: ${design.dn_code || ''}\nReed: ${design.reed || ''}\nPick: ${design.pick || ''}\nCards: ${design.cards || ''}\nWork: ${design.work || ''}\nBlue+APT: ${design.blue_apt || ''}\n----------------------------------\n*Feeder Details*\n${feedersText}\n----------------------------------`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  }

  if (loading) return <div style={{ padding: 40, color: 'var(--text-faint)' }}>Loading…</div>;
  if (!design) return <div style={{ padding: 40, color: 'var(--danger)' }}>Design not found.</div>;

  const infoPairs = [
    ['Design No', design.design_number], ['Design Name', design.design_name],
    ['DN', design.dn], ['DN Code', design.dn_code],
    ['Reed', design.reed], ['Pick', design.pick],
    ['Cards', design.cards], ['Patti', design.patti],
    ['Total D.C.', design.total_dc], ['Total Cut', design.total_cut],
    ['Work', design.work], ['Blue + APT', design.blue_apt],
  ].filter(([, v]) => v);

  const imageUrl = design.image_path ? `http://localhost:5000${design.image_path}` : null;

  return (
    <div className="fade-in" style={{ padding: '22px 28px', maxWidth: 1180 }}>
      <button onClick={() => navigate('designs')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, border: 'none', background: 'none', color: 'var(--text-muted)', font: 'inherit', fontSize: 13, fontWeight: 500, cursor: 'pointer', padding: 0, marginBottom: 16 }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        Back to designs
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 24, alignItems: 'start' }}>
        {/* Left col */}
        <div>
          <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border)', boxShadow: 'var(--shadow)', aspectRatio: '1', background: 'var(--bg-inset)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {imageUrl ? <img src={imageUrl} alt={design.design_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <svg width="64" height="64" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="var(--border-strong)" strokeWidth="1.3"/><circle cx="8.5" cy="8.5" r="1.5" stroke="var(--border-strong)" strokeWidth="1.3"/><path d="M21 15l-5-5L5 21" stroke="var(--border-strong)" strokeWidth="1.3" strokeLinejoin="round"/></svg>}
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            <button onClick={handleWhatsApp} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, height: 44, border: 'none', borderRadius: 11, background: '#25D366', color: '#06351c', font: 'inherit', fontWeight: 700, fontSize: 13.5, cursor: 'pointer' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 00-8.6 15.05L2 22l5.07-1.33A10 10 0 1012 2zm0 18.2a8.18 8.18 0 01-4.17-1.14l-.3-.18-3 .79.8-2.93-.2-.3A8.2 8.2 0 1112 20.2zm4.6-6.1c-.25-.13-1.47-.73-1.7-.81-.23-.08-.4-.13-.56.13-.17.25-.64.8-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.66-1.25-1.48-1.4-1.73-.14-.25-.01-.39.11-.51.11-.11.25-.29.38-.43.12-.15.16-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.48-.4-.42-.56-.42h-.48c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07s.89 2.4 1.01 2.56c.12.17 1.74 2.66 4.22 3.73.59.25 1.05.4 1.4.52.59.19 1.13.16 1.55.1.47-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.29z"/></svg>
              Send WhatsApp
            </button>
            <button onClick={() => window.print()} title="Print" style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)', borderRadius: 11, background: 'var(--bg-panel)', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 9V3h12v6M6 18H4a2 2 0 01-2-2v-3a2 2 0 012-2h16a2 2 0 012 2v3a2 2 0 01-2 2h-2" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><rect x="6" y="14" width="12" height="7" rx="1" stroke="currentColor" strokeWidth="1.8"/></svg>
            </button>
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button className="btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={() => openEdit(selectedId)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4 12.5-12.5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg>Edit
            </button>
            <button style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, height: 42, border: '1px solid var(--border)', borderRadius: 11, background: 'var(--bg-panel)', color: 'var(--danger)', font: 'inherit', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}
              onClick={() => setConfirmDelete(true)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 7h16M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2M6 7l1 13a1 1 0 001 1h8a1 1 0 001-1l1-13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>Delete
            </button>
          </div>
        </div>

        {/* Right col */}
        <div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 18 }}>
            <div>
              <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 13, color: 'var(--accent)', fontWeight: 600 }}>{design.design_number}</div>
              <div style={{ fontSize: 25, fontWeight: 700, letterSpacing: '-.5px', marginTop: 2 }}>{design.design_name || '—'}</div>
              <div style={{ color: 'var(--text-faint)', fontSize: 12, marginTop: 5 }}>
                Created {new Date(design.created_date).toLocaleDateString('en-IN')} · Updated {new Date(design.updated_date).toLocaleDateString('en-IN')}
              </div>
            </div>
            {design.work && <span style={{ marginLeft: 'auto', padding: '5px 11px', borderRadius: 8, background: 'var(--primary-soft)', color: 'var(--primary)', fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap' }}>{design.work}</span>}
          </div>

          <div style={{ fontWeight: 700, fontSize: 12, color: 'var(--text-muted)', letterSpacing: '.4px', marginBottom: 10 }}>DESIGN INFORMATION</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 1, background: 'var(--border)', border: '1px solid var(--border)', borderRadius: 13, overflow: 'hidden', marginBottom: 22 }}>
            {infoPairs.map(([label, value]) => (
              <div key={label} style={{ background: 'var(--bg-panel)', padding: '12px 14px' }}>
                <div style={{ color: 'var(--text-faint)', fontSize: 10.5, fontWeight: 600, letterSpacing: '.4px', textTransform: 'uppercase' }}>{label}</div>
                <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 14, fontWeight: 600, marginTop: 4 }}>{value}</div>
              </div>
            ))}
          </div>

          {(design.description || design.remarks) && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 22 }}>
              {design.description && (
                <div style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)', borderRadius: 12, padding: '13px 15px' }}>
                  <div style={{ color: 'var(--text-faint)', fontSize: 10.5, fontWeight: 600, letterSpacing: '.4px', textTransform: 'uppercase', marginBottom: 5 }}>Description</div>
                  <div style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--text-muted)' }}>{design.description}</div>
                </div>
              )}
              {design.remarks && (
                <div style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)', borderRadius: 12, padding: '13px 15px' }}>
                  <div style={{ color: 'var(--text-faint)', fontSize: 10.5, fontWeight: 600, letterSpacing: '.4px', textTransform: 'uppercase', marginBottom: 5 }}>Remarks</div>
                  <div style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--text-muted)' }}>{design.remarks}</div>
                </div>
              )}
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ fontWeight: 700, fontSize: 12, color: 'var(--text-muted)', letterSpacing: '.4px' }}>FEEDER DETAILS</div>
            <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, color: 'var(--text-faint)' }}>{(design.feeders || []).length} feeders</span>
          </div>
          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr 140px', padding: '10px 16px', background: 'var(--bg-subtle)', borderBottom: '1px solid var(--border)', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '.4px' }}>
              <span>FEEDER</span><span>COLOR NAME</span><span>OLD NUMBER</span>
            </div>
            {(design.feeders || []).sort((a, b) => a.feeder_number - b.feeder_number).map(f => (
              <div key={f.id} style={{ display: 'grid', gridTemplateColumns: '90px 1fr 140px', padding: '11px 16px', borderBottom: '1px solid var(--border)', alignItems: 'center' }}>
                <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12.5, fontWeight: 600 }}>{f.feeder_number}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <span style={{ width: 18, height: 18, borderRadius: 5, background: colorHex(f.color_name), border: '1px solid rgba(0,0,0,.2)', flexShrink: 0 }} />
                  <span style={{ fontSize: 13.5, fontWeight: 500 }}>{f.color_name}</span>
                </span>
                <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 13, color: 'var(--text-muted)' }}>{f.old_number}</span>
              </div>
            ))}
            {(design.feeders || []).length === 0 && <div style={{ padding: '20px 16px', color: 'var(--text-faint)', fontSize: 13 }}>No feeders added</div>}
          </div>
        </div>
      </div>

      {/* Delete confirm modal */}
      {confirmDelete && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ padding: 28, maxWidth: 400, width: '90%' }}>
            <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 10 }}>Delete Design?</div>
            <div style={{ color: 'var(--text-muted)', fontSize: 13.5, marginBottom: 22 }}>
              This will permanently delete <b>{design.design_number}</b> and all its feeder data. This action cannot be undone.
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setConfirmDelete(false)}>Cancel</button>
              <button className="btn-danger" style={{ flex: 1, justifyContent: 'center' }} onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
