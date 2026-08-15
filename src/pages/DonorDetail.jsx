import React, { useState, useEffect } from 'react';
import { donorApi } from '../services/api.js';
import { formatDate, isDonorEligible, getDaysSinceDonation } from '../utils/helpers.js';
import BloodBadge from '../components/BloodBadge.jsx';
import ConfirmModal from '../components/ConfirmModal.jsx';
import Topbar from '../components/Topbar.jsx';
import { EditIcon, TrashIcon, ArrowRightIcon, CheckIcon } from '../components/Icons.jsx';

export default function DonorDetail({ donorId, onBack, onEdit, onToast, onRefresh, onOpenSidebar }) {
  const [donor, setDonor]       = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true); setError(null);
    donorApi.getById(donorId)
      .then((d) => { if (!cancelled) setDonor(d); })
      .catch((e) => { if (!cancelled) setError(e.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [donorId]);

  async function handleDelete() {
    try {
      await donorApi.remove(donorId);
      onToast('Donor deleted successfully.', 'success');
      onRefresh();
      onBack();
    } catch (e) {
      onToast(`Delete failed: ${e.message}`, 'error');
    } finally {
      setConfirming(false);
    }
  }

  if (loading) {
    return (
      <div className="page-wrapper">
        <Topbar title="Donor Details" onOpenSidebar={onOpenSidebar} />
        <main className="page">
          <div className="loading-state">
            <div className="spinner" />
            <span>Fetching donor profile...</span>
          </div>
        </main>
      </div>
    );
  }

  if (error || !donor) {
    return (
      <div className="page-wrapper">
        <Topbar title="Donor Details" onOpenSidebar={onOpenSidebar} />
        <main className="page">
          <div className="empty-state card shadow-card">
            <div className="empty-state-icon">⚠️</div>
            <h3>Unable to Load Donor Profile</h3>
            <p>{error || 'The requested donor profile was not found.'}</p>
            <button className="btn btn-secondary" style={{ marginTop: 16 }} onClick={onBack}>
              ← Back to Registry
            </button>
          </div>
        </main>
      </div>
    );
  }

  const eligible = isDonorEligible(donor.lastDonationDate);
  const days     = getDaysSinceDonation(donor.lastDonationDate);

  return (
    <div className="page-wrapper">
      <Topbar
        title={`Donor: ${donor.name}`}
        subtitle={`ID: ${donor.donorId}`}
        onOpenSidebar={onOpenSidebar}
        actions={
          <div className="detail-actions">
            <button className="btn btn-secondary btn-sm" onClick={onBack}>
              ← Back
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => onEdit(donor)}>
              <EditIcon size={14} />
              <span>Edit Record</span>
            </button>
            <button className="btn btn-danger btn-sm" onClick={() => setConfirming(true)}>
              <TrashIcon size={14} />
              <span>Delete</span>
            </button>
          </div>
        }
      />

      <main className="page">
        {/* Profile Card Header */}
        <div className="card shadow-card profile-hero-card">
          <div className="profile-hero-left">
            <div className="profile-avatar">
              {(donor.name || 'D')[0].toUpperCase()}
            </div>
            <div className="profile-hero-meta">
              <h2 className="profile-name">{donor.name}</h2>
              <div className="profile-badge-row">
                <BloodBadge group={donor.bloodGroup} size="medium" />
                <span className={`eligible-pill ${eligible ? 'yes' : 'no'}`}>
                  <span className="pill-dot" />
                  <span>{eligible ? 'Eligible to Donate' : 'In 90-Day Cooldown'}</span>
                </span>
                {days !== null && (
                  <span className="tag-pill">{days} days since last donation</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Fields Grid */}
        <div className="card shadow-card" style={{ marginTop: 20 }}>
          <div className="card-header">
            <h3 className="card-title">📋 Donor Profile & Medical Information</h3>
          </div>
          <div className="detail-grid">
            <DetailField label="Donor ID" value={donor.donorId} />
            <DetailField label="Full Name" value={donor.name} />
            <DetailField label="Blood Type" value={<BloodBadge group={donor.bloodGroup} />} />
            <DetailField label="Phone Contact" value={donor.phone} />
            <DetailField label="Email Address" value={donor.email} />
            <DetailField label="Age" value={donor.age ? `${donor.age} years old` : null} />
            <DetailField label="Gender" value={donor.gender} />
            <DetailField label="City / Region" value={donor.city} />
            <DetailField label="Residential Address" value={donor.address} />
            <DetailField label="Last Donation Date" value={formatDate(donor.lastDonationDate)} />
          </div>
        </div>
      </main>

      {confirming && (
        <ConfirmModal
          title="Delete Donor Record"
          message={`Are you sure you want to permanently delete "${donor.name}"? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setConfirming(false)}
        />
      )}
    </div>
  );
}

function DetailField({ label, value }) {
  return (
    <div className="detail-field">
      <div className="detail-field-label">{label}</div>
      <div className="detail-field-value">{value || <span className="text-muted">—</span>}</div>
    </div>
  );
}
