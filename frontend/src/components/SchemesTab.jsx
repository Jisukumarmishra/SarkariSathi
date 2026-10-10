import React from 'react';
import { ArrowUpRight, Award, Clock, Loader2, Search } from 'lucide-react';

const SchemesTab = ({ schemes, isLoading }) => {
  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
          <Search className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-navy-950">Government Schemes For You</h2>
          <p className="text-sm text-navy-500">Relevant support options based on this document</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-navy-100 bg-navy-50 p-12 text-center">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
          <p className="text-sm font-semibold text-navy-500">Searching for relevant schemes...</p>
        </div>
      ) : !schemes || schemes.length === 0 ? (
        <div className="rounded-lg border border-navy-100 bg-navy-50 p-10 text-center text-sm font-semibold text-navy-500">
          No relevant schemes found for this document.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {schemes.map((scheme, idx) => (
            <article key={`${scheme.name || 'scheme'}-${idx}`} className="card-premium overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-[#FF9933] via-blue-600 to-trigreen"></div>
              <div className="flex h-full flex-col p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-[#b85f00]">
                    <Award className="h-5 w-5" />
                  </div>
                  <h3 className="pt-1 text-base font-bold leading-snug text-navy-950">
                    {scheme.name || 'Recommended Scheme'}
                  </h3>
                </div>

                {scheme.description && (
                  <p className="mt-3 flex-grow text-sm leading-6 text-navy-600">
                    {scheme.description}
                  </p>
                )}

                {scheme.eligibility && (
                  <div className="mt-4 rounded-lg border border-navy-100 bg-navy-50/70 p-3">
                    <div className="text-xs font-bold uppercase text-navy-400">Eligibility</div>
                    <div className="mt-1 text-sm font-medium leading-6 text-navy-800">
                      {scheme.eligibility}
                    </div>
                  </div>
                )}

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-navy-100 pt-4">
                  {scheme.deadline ? (
                    <div className="inline-flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700">
                      <Clock className="h-3.5 w-3.5" />
                      {scheme.deadline}
                    </div>
                  ) : (
                    <span className="text-xs font-semibold text-navy-400">Deadline not found</span>
                  )}
                  {scheme.url && (
                    <a
                      href={scheme.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-bold text-blue-700 transition hover:border-blue-200 hover:bg-blue-100"
                    >
                      View Details
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {!isLoading && schemes?.length > 0 && (
        <p className="mt-6 text-center text-xs font-medium text-navy-400">
          Scheme information is for reference. Verify details on official portals before applying.
        </p>
      )}
    </div>
  );
};

export default SchemesTab;
