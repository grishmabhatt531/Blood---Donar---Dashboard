import React, { useState, useMemo } from 'react';
import { BLOOD_GROUPS, formatDate, isDonorEligible } from '../utils/helpers.js';
import BloodBadge from '../components/BloodBadge.jsx';
import ConfirmModal from '../components/ConfirmModal.jsx';
import Topbar from '../components/Topbar.jsx';
import { SearchIcon, FilterIcon, EyeIcon, EditIcon, TrashIcon, PlusIcon } from '../components/Icons.jsx';
import { donorApi } from '../services/api.js';

export default function DonorList({ donors, loading, onNav, onOpenSidebar, onSelectDonor, onEdit, onToast, onRefresh }) {
  const [search, setSearch]     = useState('');
  const [bgFilter, setBgFilter] = useState('');
  const [deleting, setDeleting] = useState(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return donors.filter((d) => {
      const matchBg = !bgFilter || d.bloodGroup === bgFilter;
      const matchQ  = !q || [d.name, d.donorId, d.phone, d.city]
        .some((v) => (v || '').toLowerCase().includes(q));
      return matchBg && matchQ;
    });
  }, [donors, search, bgFilter]);

  async function handleDelete() {
    try {
      await donorApi.remove(deleting.donorId);
      onToast('Donor deleted successfully.', 'success');
      onRefresh();
    } catch (e) {
      onToast(`Delete failed: ${e.message}`, 'error');
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="page-wrapper">
      <Topbar
        title="Donor Registry"
        subtitle={`Managing ${filtered.length} active donor ${filtered.length === 1 ? 'profile' : 'profiles'}`}
        onOpenSidebar={onOpenSidebar}
        actions={
          <button className="btn btn-primary" onClick={() => onNav('add')}>
            <PlusIcon size={16} />
            <span>Add New Donor</span>
          </button>
        }
      />
      
      <main className="page">
        {/* Filter controls */}
        <div className="table-controls-card">
          <div className="search-input-wrap">
            <span className="search-icon">
              <SearchIcon size={18} color="#94a3b8" />
            </span>
            <input
              id="donor-search"
              className="search-input"
              type="search"
              placeholder="Search by name, donor ID, phone number or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <div className="select-wrap">
              <FilterIcon size={16} color="#64748b" />
              <select
                id="blood-group-filter"
                className="filter-select"
                value={bgFilter}
                onChange={(e) => setBgFilter(e.target.value)}
              >
                <option value="">All Blood Types</option>
                {BLOOD_GROUPS.map((g) => (
                  <option key={g} value={g}>Blood Type {g}</option>
                ))}
              </select>
            </div>

            {(search || bgFilter) && (
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => { setSearch(''); setBgFilter(''); }}
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Quick blood group filter chips */}
        <div className="quick-filter-chips">
          <span className="chips-label">Quick Filter:</span>
          <button
            className={`chip-item ${bgFilter === '' ? 'active' : ''}`}
            onClick={() => setBgFilter('')}
          >
            All
          </button>
          {BLOOD_GROUPS.map((g) => (
            <button
              key={g}
              className={`chip-item ${bgFilter === g ? 'active' : ''}`}
              onClick={() => setBgFilter(bgFilter === g ? '' : g)}
            >
              {g}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner" />
            <span>Syncing donor registry...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state card">
            <div className="empty-state-icon">🩸</div>
            <h3>No Donors Found</h3>
            <p>{search || bgFilter ? 'No records match your search criteria.' : 'No donors in database yet.'}</p>
            {!search && !bgFilter && (
              <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => onNav('add')}>
                <PlusIcon size={16} />
                <span>Register First Donor</span>
              </button>
            )}
          </div>
        ) : (
          <div className="table-wrapper shadow-card">
            <table className="table" aria-label="Donor list">
              <thead>
                <tr>
                  <th>Donor Details</th>
                  <th>Blood Type</th>
                  <th>Contact Phone</th>
                  <th>City / Location</th>
                  <th>Age & Gender</th>
                  <th>Last Donation</th>
                  <th>Eligibility</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d) => {
                  const eligible = isDonorEligible(d.lastDonationDate);
                  return (
                    <tr key={d.donorId} className="table-row-interactive">
                      <td>
                        <div className="donor-cell">
                          <div className="table-avatar">
                            {(d.name || 'D')[0].toUpperCase()}
                          </div>
                          <div>
                            <div className="donor-name">{d.name || 'Unnamed Donor'}</div>
                            <div className="donor-id">ID: {d.donorId}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <BloodBadge group={d.bloodGroup} />
                      </td>
                      <td>
                        <span className="contact-text">{d.phone || '—'}</span>
                      </td>
                      <td>
                        <span className="city-text">{d.city || 'Unlisted'}</span>
                      </td>
                      <td>
                        <span className="meta-text">
                          {d.age ? `${d.age} yrs` : '—'} {d.gender ? `• ${d.gender}` : ''}
                        </span>
                      </td>
                      <td>
                        <span className="date-text">{formatDate(d.lastDonationDate)}</span>
                      </td>
                      <td>
                        <span className={`eligible-pill ${eligible ? 'yes' : 'no'}`}>
                          <span className="pill-dot" />
                          <span>{eligible ? 'Eligible' : 'In Cooldown'}</span>
                        </span>
                      </td>
                      <td>
                        <div className="action-row-right">
                          <button
                            className="btn-icon btn-icon-view"
                            onClick={() => onSelectDonor(d.donorId)}
                            title="View donor profile"
                            aria-label={`View ${d.name}`}
                          >
                            <EyeIcon size={15} />
                          </button>
                          <button
                            className="btn-icon btn-icon-edit"
                            onClick={() => onEdit(d)}
                            title="Edit donor details"
                            aria-label={`Edit ${d.name}`}
                          >
                            <EditIcon size={15} />
                          </button>
                          <button
                            className="btn-icon btn-icon-delete"
                            onClick={() => setDeleting(d)}
                            title="Delete donor"
                            aria-label={`Delete ${d.name}`}
                          >
                            <TrashIcon size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {deleting && (
        <ConfirmModal
          title="Delete Donor Record"
          message={`Are you sure you want to permanently delete "${deleting.name}" (ID: ${deleting.donorId})? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
}
