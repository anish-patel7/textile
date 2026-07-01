import React from 'react';
import { useApp } from '../App';

const pageTitles = {
  dashboard: 'Dashboard',
  designs: 'View Designs',
  detail: 'Design Details',
  form: 'Design Entry',
  gallery: 'Image Gallery',
  reports: 'Reports',
  backup: 'Backup & Restore',
  settings: 'Settings',
};

export default function Topbar() {
  const { page, search, setSearch, dark, setDark, openNew, setSidebarOpen } = useApp();

  return (
    <header style={{ height: 62, flexShrink: 0, background: 'var(--bg-panel)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px' }}>

      {/* Hamburger — mobile only */}
      <button
        className="mobile-only"
        onClick={() => setSidebarOpen(o => !o)}
        style={{ width: 38, height: 38, display: 'none', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)', borderRadius: 9, background: 'var(--bg-subtle)', color: 'var(--text-muted)', cursor: 'pointer', flexShrink: 0 }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
      </button>

      <div style={{ fontWeight: 700, fontSize: 16, letterSpacing: '-.2px', whiteSpace: 'nowrap' }}>
        {pageTitles[page] || 'Textile Manager'}
      </div>

      {/* Search — hide on small screens */}
      <div className="search-bar" style={{ flex: 1, maxWidth: 420, marginLeft: 8, position: 'relative' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}><circle cx="11" cy="11" r="7" stroke="var(--text-faint)" strokeWidth="1.8"/><path d="M21 21l-4-4" stroke="var(--text-faint)" strokeWidth="1.8" strokeLinecap="round"/></svg>
        <input
          className="input"
          style={{ paddingLeft: 36, height: 38, fontSize: 13 }}
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search design no, DN, color…"
        />
      </div>

      <div style={{ flex: 1 }} />

      <button
        onClick={() => setDark(d => !d)}
        title="Toggle theme"
        style={{ width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)', borderRadius: 9, background: 'var(--bg-subtle)', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 16, flexShrink: 0 }}
      >
        {dark ? '☀️' : '🌙'}
      </button>

      <button className="btn-primary desktop-only" onClick={openNew} style={{ whiteSpace: 'nowrap' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round"/></svg>
        Add New Design
      </button>
    </header>
  );
}
