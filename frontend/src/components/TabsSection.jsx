import React from 'react';
import { BookOpen, CheckCircle, PenLine, Search } from 'lucide-react';
import ExplanationTab from './ExplanationTab';
import NextStepsTab from './NextStepsTab';
import SchemesTab from './SchemesTab';
import DraftReplyTab from './DraftReplyTab';

const TabsSection = ({ activeTab, onTabChange, analysisResult, schemes, isLoadingSchemes, draftReply, onDraftChange, language }) => {
  const tabs = [
    { id: 'explanation', label: 'Explanation', icon: BookOpen },
    { id: 'next-steps', label: 'Next Steps', icon: CheckCircle },
    { id: 'schemes', label: 'Schemes', icon: Search },
    { id: 'draft-reply', label: 'Draft Reply', icon: PenLine },
  ];

  return (
    <section className="flex w-full flex-col">
      <div className="no-scrollbar sticky top-0 z-10 flex gap-2 overflow-x-auto border-b border-navy-100 bg-white/95 p-2 backdrop-blur">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition-all ${
                isActive
                  ? 'bg-navy-900 text-white shadow-premium'
                  : 'text-navy-500 hover:bg-navy-50 hover:text-navy-900'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="p-4 sm:p-6">
        <div className="animate-fade-in">
          {activeTab === 'explanation' && (
            <ExplanationTab
              explanation={analysisResult.explanation}
              disclaimer={analysisResult.disclaimer}
              language={language}
            />
          )}
          {activeTab === 'next-steps' && (
            <NextStepsTab nextSteps={analysisResult.nextSteps} />
          )}
          {activeTab === 'schemes' && (
            <SchemesTab schemes={schemes} isLoading={isLoadingSchemes} />
          )}
          {activeTab === 'draft-reply' && (
            <DraftReplyTab
              draftReply={draftReply}
              onDraftChange={onDraftChange}
              language={language}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default TabsSection;
