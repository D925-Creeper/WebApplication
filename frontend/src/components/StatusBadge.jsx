import React from 'react';

export default function StatusBadge({ status, isDark = false }) {
  const configs = isDark ? {
    approved: { label: 'อนุมัติแล้ว', bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
    pending: { label: 'รอการอนุมัติ', bg: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
    rejected: { label: 'ปฏิเสธคำขอ', bg: 'bg-rose-500/15 text-rose-400 border-rose-500/30' },
    active: { label: 'พร้อมใช้งาน', bg: 'bg-teal-500/15 text-teal-400 border-teal-500/30' },
    maintenance: { label: 'ปิดปรับปรุง', bg: 'bg-slate-500/15 text-slate-400 border-slate-500/30' }
  } : {
    approved: { label: 'อนุมัติแล้ว', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    pending: { label: 'รอการอนุมัติ', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
    rejected: { label: 'ปฏิเสธคำขอ', bg: 'bg-rose-50 text-rose-700 border-rose-200' },
    active: { label: 'พร้อมใช้งาน', bg: 'bg-teal-50 text-teal-700 border-teal-200' },
    maintenance: { label: 'ปิดปรับปรุง', bg: 'bg-slate-100 text-slate-600 border-slate-200' }
  };

  const item = configs[status] || (isDark 
    ? { label: status, bg: 'bg-slate-500/15 text-slate-400 border-slate-500/30' }
    : { label: status, bg: 'bg-slate-100 text-slate-600 border-slate-200' });

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm transition-all ${item.bg}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
      {item.label}
    </span>
  );
}
