import React, { useEffect, useState } from 'react';
import { useApp } from '../App';
import { getStats, createBackup, imageUrl } from '../lib/api';

const COLOR_MAP = { Ground: '#8B7355', Black: '#1a1a1a', White: '#f5f0e8', Red: '#c0392b', Blue: '#2980b9', Green: '#27ae60', Yellow: '#f1c40f', Orange: '#e67e22', Purple: '#8e44ad', Grey: '#95a5a6', Brown: '#6d4c41', Pink: '#e91e63' };
function colorHex(name) { if (!name) return '#ccc'; for (const [k, v] of Object.entries(COLOR_MAP)) { if (name.toLowerCase().includes(k.toLowerCase())) return v; } return '#0e7c6b'; }

export default function Dashboard() {
  const { openNew, navigate, openDetail, showToast } = useApp();
  const [stats, setStats] = useState(null);
  const [backing, setBacking] = useState(false);

  useEffect(() => {
    getStats().then(setStats).catch(() => {});
  }, []);

  async function handleBackup() {
    setBacking(true);
    try {
      await createBackup();
      showToast('Backup created successfully');
    } catch (e) {
      showToast(e.message, 'error');
    } finally {
      setBacking(false);
    }
  }

  const designCount = stats?.designCount ?? '—';
  const imageCount = stats?.imageCount ?? '—';
  const feederCount = stats?.feederCount ?? '—';
  const recent = stats?.recent || [];
  const workDist = stats?.workDist || {};
  const maxWork = Math.max(...Object.values(workDist), 1);

  const statCards = [
    { label: 'Total Designs', value: designCount, color: 'var(--primary)', bg: 'var(--primary-soft)', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="M3 9h18" stroke="currentColor" strokeWidth="1.8"/></svg> },
    { label: 'Total Images', value: imageCount, color: 'var(--accent)', bg: 'var(--accent-soft)', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8"/><circle cx="8.5" cy="8.5" r="1.6" stroke="currentColor" strokeWidth="1.8"/><path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg> },
    { label: 'Total Feeders', value: feederCount, color: 'var(--success)', bg: 'var(--success-soft)', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2v20M2 12h20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg> },
    { label: 'Database', value: 'Supabase', color: 'var(--warning)', bg: 'var(--warning-soft)', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><ellipse cx="12" cy="6" rx="8" ry="3" stroke="currentColor" strokeWidth="1.8"/><path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6" stroke="currentColor" strokeWidth="1.8"/></svg> },
  ];

  const quickActions = [
    { label: 'Add New Design', color: 'var(--primary)', bg: 'var(--primary-soft)', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round"/></svg>, onClick: openNew },
    { label: 'Search Design', color: 'var(--accent)', bg: 'var(--accent-soft)', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.9"/><path d="M21 21l-4-4" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"/></svg>, onClick: () => navigate('designs') },
    { label: 'Image Gallery', color: 'var(--text-muted)', bg: 'var(--bg-inset2)', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8"/><circle cx="8.5" cy="8.5" r="1.6" stroke="currentColor" strokeWidth="1.8"/><path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg>, onClick: () => navigate('gallery') },
    { label: 'Reports', color: 'var(--warning)', bg: 'var(--warning-soft)', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M8 13v4M12 9v8M16 12v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8"/></svg>, onClick: () => navigate('reports') },
    { label: 'Backup Database', color: 'var(--success)', bg: 'var(--success-soft)', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 3v12m0 0l-4-4m4 4l4-4" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"/></svg>, onClick: handleBackup },
    { label: 'Settings', color: 'var(--text-muted)', bg: 'var(--bg-inset2)', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>, onClick: () => navigate('settings') },
  ];

  return (
    <div className="fade-in page-pad" style={{ padding: '26px 28px', maxWidth: 1240 }}>
      {/* Stat Cards */}
      <div className="dash-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        {statCards.map(s => (
          <div key={s.label} className="card" style={{ padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: 12, fontWeight: 600 }}>{s.label}</span>
              <span style={{ width: 30, height: 30, borderRadius: 8, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>{s.icon}</span>
            </div>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 30, fontWeight: 600, marginTop: 10, letterSpacing: -1 }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="dash-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20, alignItems: 'start' }}>
        <div>
          {/* Quick Actions */}
          <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-muted)', letterSpacing: '.3px', marginBottom: 12 }}>QUICK ACTIONS</div>
          <div className="dash-actions" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 28 }}>
            {quickActions.map(a => (
              <button key={a.label} onClick={a.onClick} disabled={a.label === 'Backup Database' && backing} style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-start', padding: 16, background: 'var(--bg-panel)', border: '1px solid var(--border)', borderRadius: 13, cursor: 'pointer', font: 'inherit', color: 'var(--text)', textAlign: 'left', boxShadow: 'var(--shadow)', transition: 'all .15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; }}
              >
                <span style={{ width: 34, height: 34, borderRadius: 9, background: a.bg, color: a.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{a.icon}</span>
                <span style={{ fontWeight: 600, fontSize: 13 }}>{a.label === 'Backup Database' && backing ? 'Backing up…' : a.label}</span>
              </button>
            ))}
          </div>

          {/* Recent Designs */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-muted)', letterSpacing: '.3px' }}>RECENT DESIGNS</div>
            <button onClick={() => navigate('designs')} style={{ border: 'none', background: 'none', color: 'var(--primary)', font: 'inherit', fontWeight: 600, fontSize: 12.5, cursor: 'pointer', padding: 0 }}>View all →</button>
          </div>
          <div className="dash-recent" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
            {recent.length === 0 && <div style={{ gridColumn: '1/-1', color: 'var(--text-faint)', fontSize: 13, padding: '20px 0' }}>No designs yet. Add your first design!</div>}
            {recent.map(d => (
              <button key={d.id} onClick={() => openDetail(d.id)} style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden', background: 'var(--bg-panel)', border: '1px solid var(--border)', borderRadius: 13, cursor: 'pointer', font: 'inherit', textAlign: 'left', boxShadow: 'var(--shadow)', transition: 'all .15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; }}
              >
                <div style={{ height: 96, background: 'var(--bg-inset)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {d.image_path
                    ? <img src={imageUrl(d.image_path)} alt={d.design_name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="var(--border-strong)" strokeWidth="1.5"/><circle cx="8.5" cy="8.5" r="1.5" stroke="var(--border-strong)" strokeWidth="1.5"/><path d="M21 15l-5-5L5 21" stroke="var(--border-strong)" strokeWidth="1.5" strokeLinejoin="round"/></svg>}
                </div>
                <div style={{ padding: '11px 13px' }}>
                  <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, color: 'var(--accent)', fontWeight: 600 }}>{d.design_number}</div>
                  <div style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--text)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.design_name || '—'}</div>
                  <div style={{ color: 'var(--text-faint)', fontSize: 11.5, marginTop: 3 }}>
                    {d.feeders?.length || 0} feeders · {d.work || 'No work'}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* System Status */}
        <div className="card" style={{ padding: 18 }}>
          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 14 }}>System Status</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
            {[
              ['Database', <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 600, color: 'var(--success)' }}><span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--success)' }}></span>Supabase</span>],
              ['Total Designs', <b>{designCount}</b>],
              ['Total Feeders', <b>{feederCount}</b>],
              ['Auto-save draft', <span style={{ fontWeight: 600, color: 'var(--success)' }}>On</span>],
              ['Network', <span style={{ fontWeight: 600 }}>Cloud (Supabase)</span>],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: 'var(--text-muted)' }}>{k}</span>{v}
              </div>
            ))}
          </div>

          {Object.keys(workDist).length > 0 && <>
            <div style={{ height: 1, background: 'var(--border)', margin: '16px 0' }} />
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10 }}>Work Distribution</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {Object.entries(workDist).slice(0, 5).map(([label, count]) => (
                <div key={label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                    <span style={{ color: 'var(--text-muted)' }}>{label}</span>
                    <span style={{ fontWeight: 600, fontFamily: 'IBM Plex Mono, monospace' }}>{count}</span>
                  </div>
                  <div style={{ height: 7, background: 'var(--bg-inset)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(count / maxWork * 100).toFixed(0)}%`, background: 'var(--primary)', borderRadius: 4 }} />
                  </div>
                </div>
              ))}
            </div>
          </>}
        </div>
      </div>
    </div>
  );
}
