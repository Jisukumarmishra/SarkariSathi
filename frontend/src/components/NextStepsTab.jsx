import React from 'react';
import { CheckCircle2, Clock } from 'lucide-react';

const NextStepsTab = ({ nextSteps }) => {
  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
          <CheckCircle2 className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-navy-950">Next Steps & Deadlines</h2>
          <p className="text-sm text-navy-500">Suggested actions from the document</p>
        </div>
      </div>

      {!nextSteps || nextSteps.length === 0 ? (
        <div className="rounded-lg border border-navy-100 bg-navy-50 p-10 text-center text-sm font-semibold text-navy-500">
          No specific next steps identified.
        </div>
      ) : (
        <div className="space-y-3">
          {nextSteps.map((step, idx) => (
            <div key={`${step.title || step.action || idx}-${idx}`} className="card-premium overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                <div className="h-1.5 bg-emerald-600 sm:h-auto sm:w-1.5"></div>
                <div className="flex flex-1 gap-4 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy-900 text-sm font-bold text-white shadow-premium">
                    {step.step || idx + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="break-words text-base font-bold text-navy-950">
                      {step.title || step.action || 'Next action'}
                    </h4>
                    {step.description && (
                      <p className="mt-1 text-sm leading-6 text-navy-600">
                        {step.description}
                      </p>
                    )}
                    {step.deadline && (
                      <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-amber-100 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700">
                        <Clock className="h-3.5 w-3.5" />
                        Deadline: {step.deadline}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NextStepsTab;
