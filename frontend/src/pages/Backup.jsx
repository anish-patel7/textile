import React, { useEffect, useState } from 'react';
import { useApp } from '../App';
import { getBackupStatus, createBackup, restoreBackup, deleteBackup } from '../lib/api';

export default function Backup() {
  const { showToast } = useApp();
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState('');
  const [confirmRestore, setConfirmRestore] = useState(null);

  function load() {
    getBackupStatus().then(r => { setBackups(r.backups || []); setLoading(false); }).catch(() => setLoading(false));
  }
  useEffect(() => { load(); }, []);

  async function handleBackup() {
    setWorking('backup');
    try {
      const r = await createBackup();
      showToast(`Backup created: ${r.backup?.name || 'done'}`);
      load();
    } catch (e) { showToast(e.message, 'error'); } finally { setWorking(''); }
  }

  async function handleRestore(name) {
    setWorking('restore');
    try {
      await restoreBackup(name);
      showToast('Restore completed successfully');
      setConfirmRestore(null);
    } catch (e) { showToast(e.message, 'error'); } finally { setWorking(''); }
  }

  async function handleDelete(name) {
    try {
      await deleteBackup(name);
      showToast('Backup deleted');
      load();
    } catch (e) { showToast(e.message, 'error'); }
  }

  return (
    <div className="fade-in" style={{ padding: '24px 28px', maxWidth: 900 }}>
      <div className="card" style={{ padding: 24, marginBottom: 24 }}>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Create Backup</div>
        <div style={{ color: 'var(--text-muted)', fontSize: 13.5, marginBottom: 18 }}>
          Backup includes all design records, feeder data, settings, and uploaded images. Latest 10 backups are kept automatically.
        </div>
        <button className="btn-primary" onClick={handleBackup} disabled={working === 'backup'} style={{ gap: 10 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 3v12m0 0l-4-4m4 4l4-4" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"/></svg>
          {working === 'backup' ? 'Creating Backup…' : 'Backup Now'}
        </button>
      </div>

      <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-muted)', letterSpacing: '.3px', marginBottom: 12 }}>
        BACKUP HISTORY ({backups.length} / 10)
      </div>

      {loading && <div style={{ color: 'var(--text-faint)', padding: '20px 0' }}>Loading…</div>}

      {!loading && backups.length === 0 && (
        <div style={{ textAlign: 'center', color: 'var(--text-faint)', padding: '40px 0' }}>
          No backups found. Create your first backup above.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {backups.map(b => (
          <div key={b.name} className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--success-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)', flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 3v12m0 0l-4-4m4 4l4-4" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"/></svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 13, fontWeight: 600 }}>{b.name}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 12.5, marginTop: 2 }}>
                {b.date} at {b.time} · {b.designCount ?? '?'} designs · {b.feederCount ?? '?'} feeders
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-primary" style={{ height: 36, padding: '0 14px', fontSize: 12.5, gap: 6 }} onClick={() => setConfirmRestore(b)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 21V9m0 0l-4 4m4-4l4 4" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 7V5a2 2 0 012-2h12a2 2 0 012 2v2" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"/></svg>
                Restore
              </button>
              <button style={{ height: 36, padding: '0 14px', border: '1px solid var(--border)', borderRadius: 9, background: 'none', color: 'var(--danger)', font: 'inherit', fontWeight: 600, fontSize: 12.5, cursor: 'pointer' }} onClick={() => handleDelete(b.name)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Restore confirm */}
      {confirmRestore && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ padding: 28, maxWidth: 400, width: '90%' }}>
            <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 10 }}>Restore Backup?</div>
            <div style={{ color: 'var(--text-muted)', fontSize: 13.5, marginBottom: 22 }}>
              This will <b>overwrite all current data</b> with the backup from <b>{confirmRestore.date} {confirmRestore.time}</b>. This cannot be undone.
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setConfirmRestore(null)}>Cancel</button>
              <button className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} disabled={working === 'restore'} onClick={() => handleRestore(confirmRestore.name)}>
                {working === 'restore' ? 'Restoring…' : 'Yes, Restore'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
