import React, { useEffect, useState } from 'react';
import { useApp } from '../App';
import { getDesigns } from '../lib/api';

export default function Gallery() {
  const { search, openDetail } = useApp();
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setLoading(true);
    getDesigns(search, 500).then(r => { setDesigns(r.designs || []); setLoading(false); }).catch(() => setLoading(false));
  }, [search]);

  const withImages = designs.filter(d => d.image_path);

  return (
    <div className="fade-in" style={{ padding: '24px 28px' }}>
      <div style={{ color: 'var(--text-muted)', fontSize: 13, fontWeight: 500, marginBottom: 20 }}>
        {loading ? 'Loading…' : `${withImages.length} images`}
      </div>

      {!loading && withImages.length === 0 && (
        <div style={{ textAlign: 'center', color: 'var(--text-faint)', padding: '60px 0' }}>
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" style={{ marginBottom: 12, opacity: .4 }}><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.3"/><circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>
          <div style={{ fontSize: 15, fontWeight: 600 }}>No images yet</div>
          <div style={{ fontSize: 13, marginTop: 4 }}>Upload images when adding designs</div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 12 }}>
        {withImages.map(d => (
          <button key={d.id} onClick={() => setSelected(d)} style={{ padding: 0, border: '2px solid transparent', borderRadius: 12, overflow: 'hidden', cursor: 'pointer', background: 'none', transition: 'all .15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.transform = 'scale(1.02)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'none'; }}
          >
            <div style={{ aspectRatio: '1', background: `url(http://localhost:5000${d.image_path}) center/cover`, position: 'relative' }}>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,.65))', padding: '20px 10px 8px' }}>
                <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: '#fff', fontWeight: 600 }}>{d.design_number}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,.8)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.design_name}</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
          onClick={() => setSelected(null)}
        >
          <div style={{ background: 'var(--bg-panel)', borderRadius: 16, overflow: 'hidden', maxWidth: 700, width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,.4)' }} onClick={e => e.stopPropagation()}>
            <img src={`http://localhost:5000${selected.image_path}`} alt={selected.design_name} style={{ width: '100%', maxHeight: 500, objectFit: 'contain', background: 'var(--bg-inset)' }} />
            <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, color: 'var(--accent)', fontWeight: 600 }}>{selected.design_number}</div>
                <div style={{ fontWeight: 700, fontSize: 16, marginTop: 2 }}>{selected.design_name || '—'}</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn-primary" onClick={() => { openDetail(selected.id); setSelected(null); }}>View Details</button>
                <button className="btn-ghost" onClick={() => setSelected(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
