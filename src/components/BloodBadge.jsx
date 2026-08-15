import React from 'react';
import { BLOOD_GROUP_COLORS } from '../utils/helpers.js';

export default function BloodBadge({ group, size = 'medium' }) {
  const colors = BLOOD_GROUP_COLORS[group] || { bg: '#f1f5f9', text: '#475569', border: '#cbd5e1' };
  
  return (
    <span
      className={`blood-badge badge-${size}`}
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        borderColor: colors.border
      }}
    >
      <span className="badge-drop-dot" style={{ backgroundColor: colors.text }} />
      <span className="badge-text">{group || '—'}</span>
    </span>
  );
}
