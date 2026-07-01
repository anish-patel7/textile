import React from 'react';
import { useApp } from '../App';

const items = [
  { id: 'dashboard', label: 'Home', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.7"/><rect x="14" y="3" width="7" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.7"/><rect x="14" y="12" width="7" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.7"/><rect x="3" y="16" width="7" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.7"/></svg> },
  { id: 'designs', label: 'Designs', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.7"/><path d="M3 9h18" stroke="currentColor" strokeWidth="1.7"/><path d="M8 14h8M8 17h5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg> },
  { id: 'form', label: 'Add', icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="var(--primary)"/><path d="M12 7v10M7 12h10" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/></svg>, special: true },
  { id: 'gallery', label: 'Gallery', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.7"/><circle cx="8.5" cy="8.5" r="1.8" stroke="currentColor" strokeWidth="1.7"/><path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { id: 'settings', label: 'More', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="6" cy="12" r="1.5" fill="currentColor"/><circle cx="18" cy="12" r="1.5" fill="currentColor"/></svg> },
];

export default function BottomNav() {
  const { page, navigate, openNew } = useApp();

  return (
    <nav style={{
      display: 'none',
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: 'var(--bg-panel)',
      borderTop: '1px solid var(--border)',
      padding: '6px 0 calc(6px + env(safe-area-inset-bottom))',
      zIndex: 30,
    }} className="mobile-bottom-nav">
      {items.map(item => {
        const active = page === item.id || (item.id === 'designs' && (page === 'detail'));
        return (
          <button
            key={item.id}
            onClick={() => item.id === 'form' ? openNew() : navigate(item.id)}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 3, border: 'none', background: 'none', cursor: 'pointer',
              color: active ? 'var(--primary)' : item.special ? 'var(--primary)' : 'var(--text-faint)',
              padding: '4px 0', font: 'inherit',
              transform: item.special ? 'translateY(-4px)' : 'none',
            }}
          >
            {item.icon}
            {!item.special && <span style={{ fontSize: 10, fontWeight: 600 }}>{item.label}</span>}
          </button>
        );
      })}
    </nav>
  );
}
