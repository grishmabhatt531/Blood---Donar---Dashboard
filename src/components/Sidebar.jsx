import React from 'react';
import { LogoIcon, DashboardIcon, DonorsIcon, AddUserIcon, DropIcon } from './Icons.jsx';

const navItems = [
  { id: 'dashboard', Icon: DashboardIcon, label: 'Overview' },
  { id: 'donors', Icon: DonorsIcon, label: 'Donor Registry' },
  { id: 'add', Icon: AddUserIcon, label: 'Register Donor' },
];

export default function Sidebar({ active, onNav, open, onClose }) {
  return (
    <>
      <div className={`sidebar-overlay ${open ? 'open' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-brand" onClick={() => onNav('dashboard')}>
          <div className="sidebar-brand-icon">
            <LogoIcon size={26} />
          </div>
          <div className="sidebar-brand-text">
            <div className="sidebar-title-row">
              <h1>BloodPulse</h1>
              <span className="live-badge">LIVE</span>
            </div>
            <span className="sidebar-subtitle">Lifeline Donor Network</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">Core Management</div>
          {navItems.map((item) => {
            const { Icon } = item;
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => { onNav(item.id); onClose(); }}
              >
                <span className="nav-item-icon">
                  <Icon size={18} color={isActive ? "#d90429" : "currentColor"} />
                </span>
                <span className="nav-item-label">{item.label}</span>
                {isActive && <span className="nav-active-dot" />}
              </button>
            );
          })}
        </nav>

        {/* Urgent Supply Callout Banner */}
        <div className="sidebar-widget">
          <div className="widget-header">
            <DropIcon size={16} color="#ef233c" />
            <span>Emergency Alert</span>
          </div>
          <p className="widget-text">Universal Donors (O-) are in high demand across regional centers.</p>
          <button className="widget-btn" onClick={() => { onNav('donors'); onClose(); }}>
            Find O- Donors
          </button>
        </div>

        <div className="sidebar-footer">
          <div className="footer-status">
            <span className="pulse-dot" /> AWS Cloud Synced
          </div>
          <div className="footer-ver">BloodPulse v2.4</div>
        </div>
      </aside>
    </>
  );
}
