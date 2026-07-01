const BASE = '/api';

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
export const getDesigns = (search = '', limit = 200, offset = 0) =>
  req(`/designs?search=${encodeURIComponent(search)}&limit=${limit}&offset=${offset}`);
export const getDesign = id => req(`/designs/${id}`);
export const getStats = () => req('/designs/stats');
export const createDesign = body => req('/designs', { method: 'POST', body: JSON.stringify(body) });
export const updateDesign = (id, body) => req(`/designs/${id}`, { method: 'PUT', body: JSON.stringify(body) });
export const deleteDesign = id => req(`/designs/${id}`, { method: 'DELETE' });

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
export const getSettings = () => req('/settings');
export const saveSettings = body => req('/settings', { method: 'PUT', body: JSON.stringify(body) });

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
