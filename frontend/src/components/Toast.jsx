import React from 'react';

export default function Toast({ message, type = 'success', onClose }) {
  const colors = {
    success: { bg: 'var(--success)', text: '#fff' },
    error: { bg: 'var(--danger)', text: '#fff' },
    info: { bg: 'var(--primary)', text: '#fff' },
  };
  const c = colors[type] || colors.success;

  return (
    <div
      style={{
        position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
        background: c.bg, color: c.text,
        padding: '12px 18px', borderRadius: 12,
        fontWeight: 600, fontSize: 13.5,
        boxShadow: '0 4px 20px rgba(0,0,0,.25)',
        display: 'flex', alignItems: 'center', gap: 10,
        animation: 'toastIn .3s ease',
        maxWidth: 400,
      }}
    >
      {type === 'success' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
      {type === 'error' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/><path d="M12 7v6M12 16.5v.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>}
      {message}
      <button onClick={onClose} style={{ marginLeft: 8, background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', opacity: .7, padding: 0, lineHeight: 1 }}>✕</button>
    </div>
  );
}
