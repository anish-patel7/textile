import React from 'react';
import { useApp } from '../App';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.7"/><rect x="14" y="3" width="7" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.7"/><rect x="14" y="12" width="7" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.7"/><rect x="3" y="16" width="7" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.7"/></svg> },
  { id: 'designs', label: 'View Designs', icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.7"/><path d="M3 9h18" stroke="currentColor" strokeWidth="1.7"/><path d="M8 14h8M8 17h5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg> },
  { id: 'gallery', label: 'Image Gallery', icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.7"/><circle cx="8.5" cy="8.5" r="1.8" stroke="currentColor" strokeWidth="1.7"/><path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { id: 'reports', label: 'Reports', icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M5 3h9l5 5v13a1 1 0 01-1 1H5a1 1 0 01-1-1V4a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/><path d="M13 3v6h6" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/><path d="M8 13v4M12 11v6M16 14v3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg> },
];

const systemItems = [
  { id: 'backup', label: 'Backup & Restore', icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><ellipse cx="12" cy="6" rx="8" ry="3" stroke="currentColor" strokeWidth="1.7"/><path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6" stroke="currentColor" strokeWidth="1.7"/><path d="M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" stroke="currentColor" strokeWidth="1.7"/></svg> },
  { id: 'settings', label: 'Settings', icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg> },
];

export default function Sidebar() {
  const { page, navigate, openNew } = useApp();
  const appName = localStorage.getItem('appName') || 'Textile Manager';
  const companyName = localStorage.getItem('companyName') || 'Your Company';

  return (
    <aside style={{ width: 236, flexShrink: 0, background: 'var(--sidebar-bg)', display: 'flex', flexDirection: 'column', padding: '18px 14px', gap: 4 }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '6px 8px 18px' }}>
        <div style={{ width: 38, height: 38, borderRadius: 9, background: 'linear-gradient(135deg,#0e7c6b,#c2683f)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,.25)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 5h18M3 9h18M3 13h18M3 17h18" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"/><path d="M7 3v18M13 3v18M19 3v18" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" opacity=".7"/></svg>
        </div>
        <div style={{ lineHeight: 1.15 }}>
          <div style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>{appName}</div>
          <div style={{ color: 'var(--sidebar-muted)', fontSize: 11, fontWeight: 500 }}>{companyName}</div>
        </div>
      </div>

      {/* Nav */}
      <div style={{ color: 'var(--sidebar-muted)', fontSize: 10, fontWeight: 600, letterSpacing: '1.2px', padding: '6px 10px 4px' }}>MENU</div>
      {navItems.map(item => (
        <button key={item.id} className={`sidebar-btn${page === item.id || (page === 'detail' && item.id === 'designs') || (page === 'form' && item.id === 'designs') ? ' active' : ''}`} onClick={() => navigate(item.id)}>
          {item.icon}{item.label}
        </button>
      ))}

      <div style={{ color: 'var(--sidebar-muted)', fontSize: 10, fontWeight: 600, letterSpacing: '1.2px', padding: '16px 10px 4px' }}>SYSTEM</div>
      {systemItems.map(item => (
        <button key={item.id} className={`sidebar-btn${page === item.id ? ' active' : ''}`} onClick={() => navigate(item.id)}>
          {item.icon}{item.label}
        </button>
      ))}

      <div style={{ marginTop: 'auto', padding: '12px 11px 4px', borderTop: '1px solid rgba(255,255,255,.07)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--sidebar-muted)', fontSize: 11 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 8px var(--success)' }}></span>
          Supabase · Connected
        </div>
      </div>
    </aside>
  );
}
