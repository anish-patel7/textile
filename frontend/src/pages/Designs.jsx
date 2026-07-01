import React, { useEffect, useState, useCallback } from 'react';
import { useApp } from '../App';
import { getDesigns } from '../lib/api';

const COLOR_MAP = { Ground: '#8B7355', Black: '#1a1a1a', White: '#f5f0e8', Red: '#c0392b', Blue: '#2980b9', Green: '#27ae60', Yellow: '#f1c40f', Orange: '#e67e22', Purple: '#8e44ad', Grey: '#95a5a6', Brown: '#6d4c41', Pink: '#e91e63' };
function colorHex(name) { if (!name) return '#ccc'; for (const [k, v] of Object.entries(COLOR_MAP)) { if (name.toLowerCase().includes(k.toLowerCase())) return v; } return '#0e7c6b'; }

export default function Designs() {
  const { search, openDetail } = useApp();
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');

  const load = useCallback(() => {
    setLoading(true);
    getDesigns(search, 500).then(r => { setDesigns(r.designs || []); setLoading(false); }).catch(() => setLoading(false));
  }, [search]);

  useEffect(() => { load(); }, [load]);

  const filtered = designs; // server-side search already applied

  return (
    <div className="fade-in" style={{ padding: '24px 28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18, flexWrap: 'wrap' }}>
        <div style={{ color: 'var(--text-muted)', fontSize: 13, fontWeight: 500 }}>
          {loading ? 'Loading…' : `${filtered.length} designs`}
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', background: 'var(--bg-inset)', borderRadius: 9, padding: 3, gap: 2 }}>
          <button onClick={() => setViewMode('grid')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', border: 'none', borderRadius: 7, cursor: 'pointer', font: 'inherit', fontSize: 12.5, fontWeight: 600, background: viewMode === 'grid' ? 'var(--bg-panel)' : 'transparent', color: viewMode === 'grid' ? 'var(--text)' : 'var(--text-muted)', transition: 'all .15s' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8"/><rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8"/><rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8"/><rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8"/></svg>Gallery
          </button>
          <button onClick={() => setViewMode('table')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', border: 'none', borderRadius: 7, cursor: 'pointer', font: 'inherit', fontSize: 12.5, fontWeight: 600, background: viewMode === 'table' ? 'var(--bg-panel)' : 'transparent', color: viewMode === 'table' ? 'var(--text)' : 'var(--text-muted)', transition: 'all .15s' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>Table
          </button>
        </div>
      </div>

      {loading && <div style={{ color: 'var(--text-faint)', padding: '40px 0', textAlign: 'center' }}>Loading designs…</div>}

      {!loading && filtered.length === 0 && (
        <div style={{ textAlign: 'center', color: 'var(--text-faint)', padding: '60px 0' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style={{ marginBottom: 12, opacity: .4 }}><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5"/><path d="M21 21l-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          <div style={{ fontSize: 15, fontWeight: 600 }}>No designs found</div>
          <div style={{ fontSize: 13, marginTop: 4 }}>Try a different search term</div>
        </div>
      )}

      {!loading && viewMode === 'grid' && filtered.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(210px,1fr))', gap: 16 }}>
          {filtered.map(d => (
            <button key={d.id} onClick={() => openDetail(d.id)} style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden', background: 'var(--bg-panel)', border: '1px solid var(--border)', borderRadius: 14, cursor: 'pointer', font: 'inherit', textAlign: 'left', boxShadow: 'var(--shadow)', transition: 'all .15s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; }}
            >
              <div style={{ height: 140, background: d.image_path ? `url(http://localhost:5000${d.image_path}) center/cover` : 'var(--bg-inset)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {!d.image_path && <svg width="36" height="36" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="var(--border-strong)" strokeWidth="1.3"/><circle cx="8.5" cy="8.5" r="1.5" stroke="var(--border-strong)" strokeWidth="1.3"/><path d="M21 15l-5-5L5 21" stroke="var(--border-strong)" strokeWidth="1.3" strokeLinejoin="round"/></svg>}
                <span style={{ position: 'absolute', top: 9, left: 9, background: 'rgba(0,0,0,.55)', color: '#fff', fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 6 }}>{d.design_number}</span>
              </div>
              <div style={{ padding: '13px 14px' }}>
                <div style={{ fontWeight: 600, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.design_name || '—'}</div>
                <div style={{ display: 'flex', gap: 14, marginTop: 8, fontSize: 11.5, color: 'var(--text-muted)' }}>
                  {d.reed && <span>Reed <b style={{ color: 'var(--text)', fontFamily: 'IBM Plex Mono, monospace' }}>{d.reed}</b></span>}
                  {d.pick && <span>Pick <b style={{ color: 'var(--text)', fontFamily: 'IBM Plex Mono, monospace' }}>{d.pick}</b></span>}
                  {d.cards && <span>Cards <b style={{ color: 'var(--text)', fontFamily: 'IBM Plex Mono, monospace' }}>{d.cards}</b></span>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 11 }}>
                  {(d.feeders || []).slice(0, 6).map(f => (
                    <span key={f.id} title={f.color_name} style={{ width: 15, height: 15, borderRadius: 4, background: colorHex(f.color_name), border: '1px solid rgba(0,0,0,.18)' }} />
                  ))}
                  <span style={{ color: 'var(--text-faint)', fontSize: 11, marginLeft: 2 }}>{(d.feeders || []).length} feeders</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {!loading && viewMode === 'table' && filtered.length > 0 && (
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '120px 1.4fr 80px 64px 64px 70px 1fr 100px', padding: '11px 16px', background: 'var(--bg-subtle)', borderBottom: '1px solid var(--border)', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '.4px' }}>
            <span>DESIGN NO</span><span>NAME</span><span>DN</span><span>REED</span><span>PICK</span><span>CARDS</span><span>WORK</span><span>FEEDERS</span>
          </div>
          {filtered.map(d => (
            <button key={d.id} onClick={() => openDetail(d.id)} style={{ width: '100%', display: 'grid', gridTemplateColumns: '120px 1.4fr 80px 64px 64px 70px 1fr 100px', padding: '13px 16px', border: 'none', borderBottom: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', font: 'inherit', textAlign: 'left', alignItems: 'center', color: 'var(--text)', transition: 'background .1s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-subtle)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12.5, fontWeight: 600, color: 'var(--accent)' }}>{d.design_number}</span>
              <span style={{ fontWeight: 600, fontSize: 13.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 10 }}>{d.design_name || '—'}</span>
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12.5, color: 'var(--text-muted)' }}>{d.dn}</span>
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12.5 }}>{d.reed}</span>
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12.5 }}>{d.pick}</span>
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12.5 }}>{d.cards}</span>
              <span style={{ fontSize: 12.5, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 10 }}>{d.work}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                {(d.feeders || []).slice(0, 5).map(f => (
                  <span key={f.id} title={f.color_name} style={{ width: 13, height: 13, borderRadius: 3, background: colorHex(f.color_name), border: '1px solid rgba(0,0,0,.18)' }} />
                ))}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
