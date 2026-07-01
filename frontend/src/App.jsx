import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import BottomNav from './components/BottomNav';
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

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
    setSidebarOpen(false);
  }

  function openDetail(id) { setSelectedId(id); setPage('detail'); setSidebarOpen(false); }
  function openNew() { setEditId(null); setPage('form'); setSidebarOpen(false); }
  function openEdit(id) { setEditId(id); setPage('form'); setSidebarOpen(false); }

  const ctx = { page, navigate, search, setSearch, showToast, dark, setDark, openDetail, openNew, openEdit, editId, selectedId, sidebarOpen, setSidebarOpen };

  return (
    <AppCtx.Provider value={ctx}>
      <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-app)', color: 'var(--text)' }}>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 40 }}
          />
        )}

        {/* Sidebar — hidden on mobile, slide-in when open */}
        <div style={{
          position: isMobile ? 'fixed' : 'relative',
          left: isMobile ? (sidebarOpen ? 0 : -260) : 0,
          top: 0, bottom: 0, zIndex: 50,
          transition: 'left .25s ease',
        }}>
          <Sidebar />
        </div>

        <div className="flex flex-col flex-1 min-w-0">
          <Topbar />
          <main className="flex-1 overflow-y-auto overflow-x-hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
            {page === 'dashboard' && <Dashboard />}
            {page === 'designs' && <Designs />}
            {page === 'detail' && <DesignDetail />}
            {page === 'form' && <DesignForm />}
            {page === 'gallery' && <Gallery />}
            {page === 'reports' && <Reports />}
            {page === 'backup' && <Backup />}
            {page === 'settings' && <Settings />}
          </main>
          {/* Bottom nav for mobile */}
          <BottomNav />
        </div>

        {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    </AppCtx.Provider>
  );
}
