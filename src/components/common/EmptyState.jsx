import React from 'react';

const EmptyState = ({ title = 'Nothing here yet', description, action }) => (
  <div className="empty-state">
    <svg
      className="empty-state-icon"
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M3 11h18" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
    <h4 className="mb-2">{title}</h4>
    {description && <p className="text-sm mb-4">{description}</p>}
    {action}
  </div>
);

export default EmptyState;
