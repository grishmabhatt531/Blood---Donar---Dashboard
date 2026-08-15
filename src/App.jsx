import { useState, useEffect, useCallback } from 'react';
import './index.css';
import { donorApi } from './services/api.js';
import Sidebar from './components/Sidebar.jsx';
import Toast from './components/Toast.jsx';
import Dashboard from './pages/Dashboard.jsx';
import DonorList from './pages/DonorList.jsx';
import DonorForm from './pages/DonorForm.jsx';
import DonorDetail from './pages/DonorDetail.jsx';

let toastId = 0;

export default function App() {
  const [page, setPage] = useState('dashboard');
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [editDonor, setEditDonor] = useState(null);

  const fetchDonors = useCallback(async () => {
    setLoading(true);
    try {
      const data = await donorApi.getAll();
      setDonors(Array.isArray(data) ? data : (data?.donors ?? data?.items ?? []));
    } catch (err) {
      addToast(`Failed to load donors: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDonors(); }, [fetchDonors]);

  function addToast(message, type = 'info') {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
  }
  function removeToast(id) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  function navigate(p) { setPage(p); setSidebarOpen(false); }

  function openDetail(donorId) { setSelectedId(donorId); setPage('detail'); }
  function openEdit(donor) { setEditDonor(donor); setPage('edit'); }
  function afterSave() { fetchDonors(); setPage('donors'); setEditDonor(null); }

  const openSidebar = () => setSidebarOpen(true);

  const sharedProps = { onNav: navigate, onToast: addToast, onOpenSidebar: openSidebar };

  return (
    <div className="app-shell">
      <Sidebar
        active={['dashboard', 'donors', 'add'].includes(page) ? page : null}
        onNav={navigate}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="main-content">
        {page === 'dashboard' && (
          <Dashboard donors={donors} loading={loading} {...sharedProps} />
        )}
        {page === 'donors' && (
          <DonorList
            donors={donors} loading={loading}
            onSelectDonor={openDetail} onEdit={openEdit}
            onRefresh={fetchDonors} {...sharedProps}
          />
        )}
        {page === 'add' && (
          <DonorForm onSuccess={afterSave} onCancel={() => navigate('donors')} onToast={addToast} onOpenSidebar={openSidebar} />
        )}
        {page === 'edit' && editDonor && (
          <DonorForm
            initial={editDonor}
            onSuccess={afterSave} onCancel={() => navigate('donors')} onToast={addToast} onOpenSidebar={openSidebar}
          />
        )}
        {page === 'detail' && selectedId && (
          <DonorDetail
            donorId={selectedId} onBack={() => navigate('donors')}
            onEdit={openEdit} onToast={addToast} onRefresh={fetchDonors} onOpenSidebar={openSidebar}
          />
        )}
      </div>

      <Toast toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
