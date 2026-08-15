import React, { useState, useMemo } from 'react';
import { BLOOD_GROUPS, BLOOD_GROUP_INFO, formatDate, isDonorEligible } from '../utils/helpers.js';
import BloodBadge from '../components/BloodBadge.jsx';
import Topbar from '../components/Topbar.jsx';
import { PlusIcon, DonorsIcon, DropIcon, CheckIcon, ActivityIcon, LocationIcon, ArrowRightIcon } from '../components/Icons.jsx';

export default function Dashboard({ donors, loading, onNav, onOpenSidebar }) {
  const [selectedGroup, setSelectedGroup] = useState('O-');

  const stats = useMemo(() => {
    const bloodMap = {};
    BLOOD_GROUPS.forEach((g) => (bloodMap[g] = 0));
    let eligible = 0;
    donors.forEach((d) => {
      if (bloodMap[d.bloodGroup] !== undefined) bloodMap[d.bloodGroup]++;
      if (isDonorEligible(d.lastDonationDate)) eligible++;
    });
    return {
      total: donors.length,
      bloodMap,
      eligible,
      universalDonors: bloodMap['O-'] || 0,
      citiesCount: new Set(donors.map((d) => d.city).filter(Boolean)).size
    };
  }, [donors]);

  const maxCount = Math.max(1, ...Object.values(stats.bloodMap));
  const recentDonors = [...donors].slice(-5).reverse();
  const activeGroupInfo = BLOOD_GROUP_INFO[selectedGroup] || BLOOD_GROUP_INFO['O-'];

  return (
    <div className="page-wrapper">
      <Topbar
        title="Network Overview"
        subtitle="Blood Donor Management & Regional Supply Control"
        onOpenSidebar={onOpenSidebar}
        actions={
          <button className="btn btn-primary" onClick={() => onNav('add')}>
            <PlusIcon size={16} />
            <span>Register Donor</span>
          </button>
        }
      />

      <main className="page">
        {/* Top Metric Cards Grid */}
        <div className="stat-grid">
          <div className="stat-card">
            <div className="stat-card-top">
              <div className="stat-icon-wrap icon-red">
                <DropIcon size={20} color="#d90429" />
              </div>
              <span className="stat-trend positive">+100% AWS</span>
            </div>
            <div className="stat-card-body">
              <span className="stat-value">{stats.total}</span>
              <span className="stat-label">Registered Donors</span>
            </div>
            <div className="stat-card-footer">
              <span className="stat-subtext">Active database records</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-top">
              <div className="stat-icon-wrap icon-green">
                <CheckIcon size={20} color="#059669" />
              </div>
              <span className="stat-trend positive">Ready Now</span>
            </div>
            <div className="stat-card-body">
              <span className="stat-value">{stats.eligible}</span>
              <span className="stat-label">Eligible Donors</span>
            </div>
            <div className="stat-card-footer">
              <span className="stat-subtext">Passed 90-day cooldown</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-top">
              <div className="stat-icon-wrap icon-purple">
                <ActivityIcon size={20} color="#9333ea" />
              </div>
              <span className="stat-trend urgent">High Priority</span>
            </div>
            <div className="stat-card-body">
              <span className="stat-value">{stats.universalDonors}</span>
              <span className="stat-label">Universal (O-) Donors</span>
            </div>
            <div className="stat-card-footer">
              <span className="stat-subtext">Critical emergency supply</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-top">
              <div className="stat-icon-wrap icon-blue">
                <LocationIcon size={20} color="#2563eb" />
              </div>
              <span className="stat-trend neutral">Coverage</span>
            </div>
            <div className="stat-card-body">
              <span className="stat-value">{stats.citiesCount}</span>
              <span className="stat-label">Cities Covered</span>
            </div>
            <div className="stat-card-footer">
              <span className="stat-subtext">Regional distribution</span>
            </div>
          </div>
        </div>

        {/* Section 2: Distribution Chart + Universal Compatibility Feature Banner */}
        <div className="dashboard-grid-2">
          {/* Blood Distribution Breakdown */}
          <div className="card shadow-card">
            <div className="card-header">
              <div>
                <h3 className="card-title">
                  <DropIcon size={18} color="#d90429" />
                  <span>Blood Inventory Breakdown</span>
                </h3>
                <p className="card-subtitle">Live donor counts categorized by blood group</p>
              </div>
              <span className="tag-pill">8 Types</span>
            </div>

            {loading ? (
              <div className="loading-state">
                <div className="spinner" />
                <span>Syncing live donor data...</span>
              </div>
            ) : (
              <div className="bg-chart-list">
                {BLOOD_GROUPS.map((g) => {
                  const count = stats.bloodMap[g] || 0;
                  const percent = Math.round((count / maxCount) * 100);
                  const isSelected = selectedGroup === g;

                  return (
                    <div
                      key={g}
                      className={`bg-chart-item ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSelectedGroup(g)}
                    >
                      <div className="bg-chart-badge-wrap">
                        <BloodBadge group={g} size="small" />
                      </div>

                      <div className="bg-chart-track">
                        <div
                          className="bg-chart-fill"
                          style={{ width: `${percent}%` }}
                        />
                      </div>

                      <div className="bg-chart-meta">
                        <span className="bg-chart-count">{count}</span>
                        <span className="bg-chart-unit">donors</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Interactive Blood Compatibility Matrix Widget (Human-crafted feel!) */}
          <div className="card hero-insight-card">
            <div className="hero-insight-bg" />
            <div className="hero-insight-content">
              <div className="insight-badge">
                <span className="pulse-dot-red" />
                <span>Compatibility Intelligence</span>
              </div>

              <div className="insight-header">
                <h2>Blood Type: <span className="group-highlight">{selectedGroup}</span></h2>
                <p className="insight-tagline">{activeGroupInfo.title} ({activeGroupInfo.tag})</p>
              </div>

              <div className="compat-grid">
                <div className="compat-box">
                  <span className="compat-label">Can Donate To:</span>
                  <div className="compat-badges">
                    {activeGroupInfo.donateTo.map((g) => (
                      <BloodBadge key={g} group={g} size="small" />
                    ))}
                  </div>
                </div>

                <div className="compat-box">
                  <span className="compat-label">Can Receive From:</span>
                  <div className="compat-badges">
                    {activeGroupInfo.receiveFrom.map((g) => (
                      <BloodBadge key={g} group={g} size="small" />
                    ))}
                  </div>
                </div>
              </div>

              <div className="insight-stats-footer">
                <div className="insight-count-block">
                  <span className="insight-num">{stats.bloodMap[selectedGroup] || 0}</span>
                  <span className="insight-lbl">Donors Available in System</span>
                </div>
                <button
                  className="btn btn-light-glow"
                  onClick={() => onNav('donors')}
                >
                  <span>Filter {selectedGroup} Donors</span>
                  <ArrowRightIcon size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Recent Activity + Quick Actions */}
        <div className="dashboard-grid-2" style={{ marginTop: 24 }}>
          {/* Recent Donors Stream */}
          <div className="card shadow-card">
            <div className="card-header">
              <div>
                <h3 className="card-title">
                  <DonorsIcon size={18} color="#2563eb" />
                  <span>Recent Registrations</span>
                </h3>
                <p className="card-subtitle">Latest donor profiles registered in system</p>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => onNav('donors')}>
                <span>View All</span>
                <ArrowRightIcon size={14} />
              </button>
            </div>

            {loading ? (
              <div className="loading-state"><div className="spinner" /></div>
            ) : recentDonors.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">🩸</div>
                <h3>No Donors Found</h3>
                <p>Register your first blood donor to start building your emergency network.</p>
              </div>
            ) : (
              <div className="recent-list">
                {recentDonors.map((d) => (
                  <div className="recent-item" key={d.donorId}>
                    <div className="recent-avatar">
                      {(d.name || 'D')[0].toUpperCase()}
                    </div>
                    <div className="recent-details">
                      <span className="recent-name">{d.name}</span>
                      <span className="recent-meta">
                        {d.city || 'Location unlisted'} • {d.phone || 'No contact'}
                      </span>
                    </div>
                    <BloodBadge group={d.bloodGroup} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions & System Status */}
          <div className="card shadow-card">
            <div className="card-header">
              <div>
                <h3 className="card-title">
                  <ActivityIcon size={18} color="#059669" />
                  <span>Quick Network Actions</span>
                </h3>
                <p className="card-subtitle">Manage regional donor operations</p>
              </div>
            </div>

            <div className="quick-actions-stack">
              <button className="action-tile action-tile-primary" onClick={() => onNav('add')}>
                <div className="action-tile-icon">
                  <PlusIcon size={20} color="#ffffff" />
                </div>
                <div className="action-tile-text">
                  <h4>Add New Donor Profile</h4>
                  <p>Register new donor details, contact, and donation date</p>
                </div>
                <ArrowRightIcon size={18} />
              </button>

              <button className="action-tile" onClick={() => onNav('donors')}>
                <div className="action-tile-icon icon-secondary">
                  <DonorsIcon size={20} color="#d90429" />
                </div>
                <div className="action-tile-text">
                  <h4>Browse & Filter Donors</h4>
                  <p>Search by donor name, city, phone or filter by blood group</p>
                </div>
                <ArrowRightIcon size={18} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
