import React from 'react';
import { FileCheck2, Languages, ShieldCheck } from 'lucide-react';

const Header = ({ language }) => {
  return (
    <section className="relative mb-8 overflow-hidden rounded-lg border border-white/70 bg-white shadow-premium">
      <div className="absolute left-0 right-0 top-0 z-20 flex h-1 w-full">
        <div className="flex-1 bg-[#FF9933]"></div>
        <div className="flex-1 bg-white"></div>
        <div className="flex-1 bg-[#138808]"></div>
      </div>

      <div className="absolute -right-10 -top-12 z-0 opacity-[0.035] pointer-events-none">
        <svg viewBox="0 0 100 100" className="h-56 w-56 text-[#000080]" fill="none" stroke="currentColor">
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

      <div className="relative z-10 grid gap-6 p-6 md:grid-cols-[1fr_auto] md:p-8">
        <div className="min-w-0">
          <div className="mb-4 inline-flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
            <ShieldCheck className="h-4 w-4" />
            Guidance only, verify with the official office
          </div>
          <h1 className="text-2xl font-bold leading-tight text-navy-950 sm:text-3xl">
            आपके सरकारी काम का AI साथी
          </h1>
          <p className="mt-2 text-base font-medium text-navy-500">
            Apke Sarkari Kaam Ka AI Saathi
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-navy-600">
            Upload a notice, bill, form, or letter to get a plain-language summary, next steps, related schemes, and a ready draft in your chosen language.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:w-80 md:grid-cols-1">
          <div className="rounded-lg border border-navy-100 bg-navy-50/70 p-3">
            <FileCheck2 className="mb-2 h-5 w-5 text-blue-600" />
            <p className="text-xs font-semibold uppercase text-navy-400">Documents</p>
            <p className="text-sm font-bold text-navy-900">PDF and images</p>
          </div>
          <div className="rounded-lg border border-navy-100 bg-navy-50/70 p-3">
            <Languages className="mb-2 h-5 w-5 text-trigreen" />
            <p className="text-xs font-semibold uppercase text-navy-400">Language</p>
            <p className="truncate text-sm font-bold text-navy-900">{language}</p>
          </div>
          <div className="rounded-lg border border-navy-100 bg-navy-50/70 p-3">
            <ShieldCheck className="mb-2 h-5 w-5 text-[#FF9933]" />
            <p className="text-xs font-semibold uppercase text-navy-400">Output</p>
            <p className="text-sm font-bold text-navy-900">Action-ready</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Header;
