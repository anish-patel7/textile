import React, { useState, useEffect, createContext, useContext } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Toast from './components/Toast';
import Dashboard from './pages/Dashboard';
import Designs from './pages/Designs';
import DesignDetail from './pages/DesignDetail';
import DesignForm from './pages/DesignForm';
import Gallery from './pages/Gallery';
import Reports from './pages/Reports';
import Backup from './pages/Backup';
import Settings from './pages/Settings';

export const AppCtx = createContext(null);
export const useApp = () => useContext(AppCtx);

export default function App() {
  const [page, setPage] = useState('dashboard');
  const [selectedId, setSelectedId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  function showToast(msg, type = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  function navigate(p, id = null) {
    setPage(p);
    if (id !== undefined) setSelectedId(id);
  }

  function openDetail(id) { setSelectedId(id); setPage('detail'); }
  function openNew() { setEditId(null); setPage('form'); }
  function openEdit(id) { setEditId(id); setPage('form'); }

  const ctx = { page, navigate, search, setSearch, showToast, dark, setDark, openDetail, openNew, openEdit, editId, selectedId };

  return (
    <AppCtx.Provider value={ctx}>
      <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-app)', color: 'var(--text)' }}>
        <Sidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <Topbar />
          <main className="flex-1 overflow-y-auto overflow-x-hidden">
            {page === 'dashboard' && <Dashboard />}
            {page === 'designs' && <Designs />}
            {page === 'detail' && <DesignDetail />}
            {page === 'form' && <DesignForm />}
            {page === 'gallery' && <Gallery />}
            {page === 'reports' && <Reports />}
            {page === 'backup' && <Backup />}
            {page === 'settings' && <Settings />}
          </main>
        </div>
        {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    </AppCtx.Provider>
  );
}
