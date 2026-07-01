import React, { useState, useEffect } from 'react';
import { getReportData, downloadExcel, downloadPDF } from '../lib/api';

const PERIODS = [
  { id: 'all', label: 'All Time' },
  { id: 'today', label: 'Today' },
  { id: 'week', label: 'This Week' },
  { id: 'month', label: 'This Month' },
  { id: 'year', label: 'This Year' },
];

export default function Reports() {
  const [period, setPeriod] = useState('all');
  const [search, setSearch] = useState('');
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getReportData(period, search).then(d => { setDesigns(d); setLoading(false); }).catch(() => setLoading(false));
  }, [period, search]);

  return (
    <div className="fade-in" style={{ padding: '24px 28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', background: 'var(--bg-inset)', borderRadius: 10, padding: 3, gap: 2 }}>
          {PERIODS.map(p => (
            <button key={p.id} onClick={() => setPeriod(p.id)} style={{ padding: '7px 14px', border: 'none', borderRadius: 8, cursor: 'pointer', font: 'inherit', fontSize: 12.5, fontWeight: 600, background: period === p.id ? 'var(--bg-panel)' : 'transparent', color: period === p.id ? 'var(--text)' : 'var(--text-muted)', transition: 'all .15s' }}>
              {p.label}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}><circle cx="11" cy="11" r="7" stroke="var(--text-faint)" strokeWidth="1.8"/><path d="M21 21l-4-4" stroke="var(--text-faint)" strokeWidth="1.8" strokeLinecap="round"/></svg>
          <input className="input" style={{ paddingLeft: 32, width: 220, height: 38 }} value={search} onChange={e => setSearch(e.target.value)} placeholder="Filter by name/number…" />
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>{loading ? 'Loading…' : `${designs.length} records`}</div>

        <button className="btn-ghost" onClick={() => downloadExcel()} style={{ gap: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="M8 12l2.5 3L16 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Export Excel
        </button>
        <button className="btn-primary" onClick={() => downloadPDF()} style={{ gap: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 3h9l5 5v13a1 1 0 01-1 1H5a1 1 0 01-1-1V4a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="M13 3v6h6" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg>
          Export PDF
        </button>
      </div>

      {!loading && designs.length === 0 && (
        <div style={{ textAlign: 'center', color: 'var(--text-faint)', padding: '60px 0' }}>No data for selected period.</div>
      )}

      {designs.length > 0 && (
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '120px 1.4fr 80px 64px 64px 70px 1fr 80px', padding: '11px 16px', background: 'var(--bg-subtle)', borderBottom: '1px solid var(--border)', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '.4px' }}>
            <span>DESIGN NO</span><span>NAME</span><span>DN</span><span>REED</span><span>PICK</span><span>CARDS</span><span>WORK</span><span>FEEDERS</span>
          </div>
          {designs.map(d => (
            <div key={d.id} style={{ display: 'grid', gridTemplateColumns: '120px 1.4fr 80px 64px 64px 70px 1fr 80px', padding: '13px 16px', borderBottom: '1px solid var(--border)', alignItems: 'center' }}>
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12.5, fontWeight: 600, color: 'var(--accent)' }}>{d.design_number}</span>
              <span style={{ fontWeight: 600, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 10 }}>{d.design_name || '—'}</span>
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, color: 'var(--text-muted)' }}>{d.dn}</span>
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12 }}>{d.reed}</span>
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12 }}>{d.pick}</span>
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12 }}>{d.cards}</span>
              <span style={{ fontSize: 12.5, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 10 }}>{d.work}</span>
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12 }}>{(d.feeders || []).length}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
