const BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';
const IMG_BASE = import.meta.env.VITE_API_URL || '';

export const imageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path; // full Supabase Storage URL
  return `${IMG_BASE}${path}`; // legacy local path
};

// Simple in-memory cache (60s TTL)
const cache = new Map();
function cached(key, fn, ttl = 60000) {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.ts < ttl) return Promise.resolve(hit.data);
  return fn().then(data => { cache.set(key, { data, ts: Date.now() }); return data; });
}
export function clearCache(prefix) {
  for (const k of cache.keys()) if (!prefix || k.startsWith(prefix)) cache.delete(k);
}

async function req(path, options = {}) {
  const res = await fetch(BASE + path, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

// Designs
export const getDesigns = (search = '', limit = 100, offset = 0) => {
  const key = `designs:${search}:${limit}:${offset}`;
  return cached(key, () => req(`/designs?search=${encodeURIComponent(search)}&limit=${limit}&offset=${offset}`));
};
export const getDesign = id => cached(`design:${id}`, () => req(`/designs/${id}`));
export const getStats = () => cached('stats', () => req('/designs/stats'), 30000);
export const createDesign = body => req('/designs', { method: 'POST', body: JSON.stringify(body) }).then(r => { clearCache('designs'); clearCache('stats'); return r; });
export const updateDesign = (id, body) => req(`/designs/${id}`, { method: 'PUT', body: JSON.stringify(body) }).then(r => { clearCache('designs'); clearCache(`design:${id}`); clearCache('stats'); return r; });
export const deleteDesign = id => req(`/designs/${id}`, { method: 'DELETE' }).then(r => { clearCache('designs'); clearCache(`design:${id}`); clearCache('stats'); return r; });

// Feeders
export const searchFeeders = q => req(`/feeders/search?q=${encodeURIComponent(q)}`);

// Upload
export async function uploadImage(file) {
  const form = new FormData();
  form.append('image', file);
  const res = await fetch(`${BASE}/upload`, { method: 'POST', body: form });
  if (!res.ok) throw new Error('Upload failed');
  return res.json();
}
export const deleteImage = filename => fetch(`${BASE}/upload/${filename}`, { method: 'DELETE' }).then(r => r.json());

// Settings
export const getSettings = () => cached('settings', () => req('/settings'));
export const saveSettings = body => req('/settings', { method: 'PUT', body: JSON.stringify(body) }).then(r => { clearCache('settings'); return r; });

// Backup
export const getBackupStatus = () => req('/backup/status');
export const createBackup = () => req('/backup', { method: 'POST' });
export const restoreBackup = name => req(`/backup/restore/${name}`, { method: 'POST' });
export const deleteBackup = name => req(`/backup/${name}`, { method: 'DELETE' });

// Reports
export const getReportData = (period, search) =>
  req(`/reports/data?period=${period || ''}&search=${encodeURIComponent(search || '')}`);
export const downloadExcel = () => { window.open(`${BASE}/reports/excel`, '_blank'); };
export const downloadPDF = () => { window.open(`${BASE}/reports/pdf`, '_blank'); };
