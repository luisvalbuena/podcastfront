import React from 'react';

const StatusBadge = ({ type }) => {
  const styles = {
    connected: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    connecting: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    disconnected: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
    recording: 'bg-red-500/10 text-red-500 border-red-500/20 animate-pulse',
    error: 'bg-red-600/10 text-red-600 border-red-600/20',
  };

  const labels = {
    connected: 'Online',
    connecting: 'Conectando...',
    disconnected: 'Offline',
    recording: 'Rec',
    error: 'Error',
  };

  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border ${styles[type] || styles.disconnected}`}>
      {labels[type] || type}
    </span>
  );
};

export default StatusBadge;