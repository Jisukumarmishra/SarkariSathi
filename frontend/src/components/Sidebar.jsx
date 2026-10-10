import React from 'react';
import { BookOpen, CheckCircle2, FileText, Home, PenLine, Search, Upload } from 'lucide-react';

const Sidebar = ({ activePage, onNavigate }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'upload', label: 'Upload & Analyze', icon: Upload },
    { id: 'explain', label: 'Explanation', icon: BookOpen },
    { id: 'next-steps', label: 'Next Steps', icon: CheckCircle2 },
    { id: 'schemes', label: 'Schemes', icon: Search },
    { id: 'draft', label: 'Draft Applications', icon: PenLine },
  ];

  return (
    <aside className="relative flex h-screen w-72 flex-col overflow-hidden border-r border-white/10 bg-navy-950 text-white shadow-premium-xl">
      <div className="z-10 flex h-1.5 w-full">
        <div className="flex-1 bg-[#FF9933]"></div>
        <div className="flex-1 bg-white"></div>
        <div className="flex-1 bg-[#138808]"></div>
      </div>

      <div className="relative z-10 border-b border-white/10 p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white shadow-blue-glow">
            <svg viewBox="0 0 100 100" className="h-9 w-9 text-[#000080]" fill="none" stroke="currentColor">
              <circle cx="50" cy="50" r="45" strokeWidth="2" fill="none" />
              <circle cx="50" cy="50" r="8" fill="currentColor" />
              {Array.from({ length: 24 }).map((_, i) => (
                <line
                  key={i}
                  x1="50"
                  y1="50"
                  x2="50"
                  y2="5"
                  strokeWidth="1.5"
                  transform={`rotate(${i * 15} 50 50)`}
                />
              ))}
            </svg>
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-xl font-bold">सरकारी साथी</h1>
            <p className="text-xs font-medium uppercase text-blue-200">Sarkari Saathi</p>
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase text-navy-300">
            <FileText className="h-4 w-4 text-[#FF9933]" />
            Current workflow
          </div>
          <p className="text-sm leading-5 text-navy-100">Upload, understand, act, and draft with one guided flow.</p>
        </div>
      </div>

      <nav className="scrollbar-dark relative z-10 flex-1 space-y-1 overflow-y-auto px-4 py-5">
        {navItems.map((item) => {
          const isActive = activePage === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`group flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-white text-navy-950 shadow-premium'
                  : 'text-navy-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className={`flex h-8 w-8 items-center justify-center rounded-lg border transition ${
                isActive ? 'border-blue-100 bg-blue-50 text-blue-700' : 'border-white/10 bg-white/[0.04] text-navy-300 group-hover:text-blue-200'
              }`}>
                <Icon className="h-4 w-4" />
              </span>
              <span className="min-w-0 truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="relative z-10 p-4">
        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
          <p className="text-xs font-semibold uppercase text-navy-300">Designed for</p>
          <p className="mt-1 text-sm font-semibold text-white">Plain-language government help</p>
        </div>
      </div>

      <div className="pointer-events-none absolute -bottom-8 left-6 right-6 text-white/10">
        <svg viewBox="0 0 200 100" fill="currentColor" className="h-auto w-full">
          <path d="M100 10 L150 40 L50 40 Z" />
          <rect x="60" y="40" width="10" height="50" />
          <rect x="80" y="40" width="10" height="50" />
          <rect x="110" y="40" width="10" height="50" />
          <rect x="130" y="40" width="10" height="50" />
          <rect x="40" y="90" width="120" height="10" />
          <circle cx="100" cy="25" r="5" fill="#fff" />
        </svg>
      </div>
    </aside>
  );
};

export default Sidebar;
