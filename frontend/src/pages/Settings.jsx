import React, { useEffect, useState } from 'react';
import { useApp } from '../App';
import { getSettings, saveSettings } from '../lib/api';

export default function Settings() {
  const { showToast, dark, setDark } = useApp();
  const [form, setForm] = useState({ app_name: '', company_name: '', whatsapp_number: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getSettings().then(s => {
      setForm({
        app_name: s.app_name || 'Textile Manager',
        company_name: s.company_name || '',
        whatsapp_number: s.whatsapp_number || '',
      });
      if (s.app_name) localStorage.setItem('appName', s.app_name);
      if (s.company_name) localStorage.setItem('companyName', s.company_name);
    }).catch(() => {});
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      await saveSettings(form);
      localStorage.setItem('appName', form.app_name);
      localStorage.setItem('companyName', form.company_name);
      showToast('Settings saved');
    } catch (e) {
      showToast(e.message, 'error');
    } finally {
      setSaving(false);
    }
  }

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  return (
    <div className="fade-in" style={{ padding: '24px 28px', maxWidth: 700 }}>
      <div className="card" style={{ padding: 28, marginBottom: 20 }}>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Application Settings</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label className="label">Application Name</label>
            <input className="input" value={form.app_name} onChange={e => set('app_name', e.target.value)} placeholder="Textile Manager" />
          </div>
          <div>
            <label className="label">Company Name</label>
            <input className="input" value={form.company_name} onChange={e => set('company_name', e.target.value)} placeholder="Your Company Name" />
          </div>
          <div>
            <label className="label">WhatsApp Default Number</label>
            <input className="input" value={form.whatsapp_number} onChange={e => set('whatsapp_number', e.target.value)} placeholder="+91 9999 999999" />
            <div style={{ fontSize: 11.5, color: 'var(--text-faint)', marginTop: 5 }}>Used for WhatsApp sharing on design detail page</div>
          </div>
        </div>

        <div style={{ marginTop: 24 }}>
          <button className="btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save Settings'}
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: 28 }}>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Appearance</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Dark Mode</div>
            <div style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 2 }}>Switch between light and dark theme</div>
          </div>
          <button onClick={() => setDark(d => !d)} style={{ width: 52, height: 28, borderRadius: 14, border: 'none', background: dark ? 'var(--primary)' : 'var(--bg-inset2)', cursor: 'pointer', position: 'relative', transition: 'background .2s' }}>
            <span style={{ position: 'absolute', top: 3, left: dark ? 26 : 3, width: 22, height: 22, borderRadius: '50%', background: '#fff', transition: 'left .2s', boxShadow: '0 1px 4px rgba(0,0,0,.25)' }} />
          </button>
        </div>

        <div style={{ height: 1, background: 'var(--border)', margin: '20px 0' }} />

        <div style={{ fontSize: 13.5, color: 'var(--text-muted)' }}>
          <div style={{ fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>Database</div>
          <div>Provider: <b>Supabase (PostgreSQL)</b></div>
          <div style={{ marginTop: 4 }}>Configure SUPABASE_URL and SUPABASE_SERVICE_KEY in <code style={{ background: 'var(--bg-inset)', padding: '1px 6px', borderRadius: 4, fontFamily: 'IBM Plex Mono, monospace', fontSize: 12 }}>backend/.env</code></div>
        </div>
      </div>
    </div>
  );
}
