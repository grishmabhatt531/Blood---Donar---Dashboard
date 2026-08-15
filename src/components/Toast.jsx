import { useEffect } from 'react';

export default function Toast({ toasts, removeToast }) {
  return (
    <div className="toast-container" role="region" aria-label="Notifications">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={() => removeToast(t.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onRemove }) {
  useEffect(() => {
    const timer = setTimeout(onRemove, 4000);
    return () => clearTimeout(timer);
  }, [onRemove]);

  const icons = { success: '✅', error: '❌', info: 'ℹ️' };

  return (
    <div className={`toast ${toast.type}`} role="alert">
      <span className="toast-icon">{icons[toast.type] ?? 'ℹ️'}</span>
      <span style={{ flex: 1 }}>{toast.message}</span>
      <button
        className="btn btn-ghost btn-sm"
        onClick={onRemove}
        style={{ padding: '2px 6px', minWidth: 'auto' }}
        aria-label="Dismiss"
      >✕</button>
    </div>
  );
}
