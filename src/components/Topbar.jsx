import React from 'react';

export default function Topbar({ title, subtitle, onOpenSidebar, actions }) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
  });

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="hamburger" onClick={onOpenSidebar} aria-label="Open navigation menu">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <div className="topbar-heading">
          <h1 className="topbar-title">{title}</h1>
          {subtitle && <p className="topbar-subtitle">{subtitle}</p>}
        </div>
      </div>

      <div className="topbar-right">
        <div className="topbar-date-pill">
          <span className="date-icon">🗓️</span>
          <span>{currentDate}</span>
        </div>
        {actions && <div className="topbar-actions">{actions}</div>}
      </div>
    </header>
  );
}
