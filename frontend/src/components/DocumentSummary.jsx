import React from 'react';
import { AlertTriangle, Building2, CheckCircle, Clock, FileText, IndianRupee } from 'lucide-react';

const isUsefulValue = (value) => value && String(value).trim().toLowerCase() !== 'not found';

const normalizeKeyFields = (keyFields) => {
  if (!keyFields) return [];

  if (Array.isArray(keyFields)) {
    return keyFields
      .map((field) => ({
        label: field?.label || field?.key || 'Detail',
        value: field?.value || 'Not found',
      }))
      .filter((field) => isUsefulValue(field.label) || isUsefulValue(field.value));
  }

  if (typeof keyFields === 'object') {
    return Object.entries(keyFields).map(([label, value]) => ({
      label: label.replace(/([A-Z])/g, ' $1').trim(),
      value: value || 'Not found',
    }));
  }

  return [];
};

const DocumentSummary = ({ analysis }) => {
  if (!analysis) return null;

  const { docType, issuer, amountDue, deadline, penalty, urgency, keyFields, requiredActions } = analysis;
  const normalizedFields = normalizeKeyFields(keyFields);

  const urgencyConfig = {
    high: {
      label: 'High Urgency',
      icon: AlertTriangle,
      className: 'border-red-200 bg-red-50 text-red-700',
    },
    medium: {
      label: 'Medium Urgency',
      icon: Clock,
      className: 'border-amber-200 bg-amber-50 text-amber-700',
    },
    low: {
      label: 'Low Urgency',
      icon: CheckCircle,
      className: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    },
  };

  const normalizedUrgency = urgency?.toLowerCase?.() || 'medium';
  const currentUrgency = urgencyConfig[normalizedUrgency] || urgencyConfig.medium;
  const UrgencyIcon = currentUrgency.icon;

  const summaryCards = [
    { label: 'Document Type', value: docType, icon: FileText, accent: 'bg-blue-600' },
    { label: 'Issuer', value: issuer, icon: Building2, accent: 'bg-trigreen' },
    { label: 'Amount Due', value: amountDue, icon: IndianRupee, accent: 'bg-rose-500' },
    { label: 'Deadline', value: deadline, icon: Clock, accent: 'bg-[#FF9933]' },
    { label: 'Penalty', value: penalty, icon: AlertTriangle, accent: 'bg-red-500' },
  ];

  return (
    <section className="mb-6 animate-slide-up space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-900 text-white shadow-premium">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-navy-950">Document Summary</h2>
            <p className="text-sm text-navy-500">Key details extracted from your document</p>
          </div>
        </div>
        <div className={`inline-flex w-fit items-center gap-2 rounded-lg border px-3 py-2 text-xs font-bold uppercase ${currentUrgency.className}`}>
          <UrgencyIcon className="h-4 w-4" />
          {currentUrgency.label}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {summaryCards.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="card-premium p-4">
              <div className={`mb-4 h-1 w-10 rounded-full ${item.accent}`}></div>
              <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase text-navy-400">
                <Icon className="h-4 w-4" />
                {item.label}
              </div>
              <p className={`break-words text-sm font-bold leading-5 ${isUsefulValue(item.value) ? 'text-navy-950' : 'text-navy-400'}`}>
                {item.value || 'Not found'}
              </p>
            </div>
          );
        })}
      </div>

      {normalizedFields.length > 0 && (
        <div className="card-premium p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-sm font-bold uppercase text-navy-900">Key Information</h3>
            <div className="h-px flex-1 bg-navy-100"></div>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {normalizedFields.map((field, idx) => (
              <div key={`${field.label}-${idx}`} className="rounded-lg border border-navy-100 bg-navy-50/60 p-3">
                <p className="text-xs font-semibold uppercase text-navy-400">{field.label}</p>
                <p className={`mt-1 break-words text-sm font-semibold ${isUsefulValue(field.value) ? 'text-navy-900' : 'text-navy-400'}`}>
                  {field.value || 'Not found'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {requiredActions?.length > 0 && (
        <div className="card-premium p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-sm font-bold uppercase text-navy-900">Required Actions</h3>
            <div className="h-px flex-1 bg-navy-100"></div>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {requiredActions.map((action, idx) => (
              <div key={`${action}-${idx}`} className="flex gap-3 rounded-lg border border-emerald-100 bg-emerald-50/60 p-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-xs font-bold text-white">
                  {idx + 1}
                </div>
                <p className="text-sm font-medium leading-6 text-navy-800">{action}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default DocumentSummary;
