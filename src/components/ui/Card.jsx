import React from 'react';

const Card = ({ children, title, description, className = '' }) => {
  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl ${className}`}>
      {(title || description) && (
        <div className="px-6 py-5 border-b border-slate-800 bg-slate-800/20">
          {title && <h3 className="text-white font-bold tracking-tight">{title}</h3>}
          {description && <p className="text-slate-500 text-xs mt-1">{description}</p>}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default Card;