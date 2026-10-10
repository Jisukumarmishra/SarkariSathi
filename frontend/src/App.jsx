import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import UploadSection from './components/UploadSection';
import DocumentSummary from './components/DocumentSummary';
import TabsSection from './components/TabsSection';
import { analyzeDocument, getSchemes } from './services/api';

function App() {
  const [language, setLanguage] = useState('Hindi');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [schemes, setSchemes] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoadingSchemes, setIsLoadingSchemes] = useState(false);
  const [activeTab, setActiveTab] = useState('explanation');
  const [draftReply, setDraftReply] = useState('');
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState('home');

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleAnalyze = async (file, question) => {
    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);
    setSchemes([]);
    
    try {
      const result = await analyzeDocument(file, question, language);
      setAnalysisResult(result);
      if (result.draftReply) {
        setDraftReply(result.draftReply);
      }
      setActiveTab('explanation');
      setActivePage('explain');

      // Fetch schemes automatically
      setIsLoadingSchemes(true);
      try {
        const schemesData = await getSchemes(result.sessionId, language);
        if (schemesData && schemesData.schemes) {
          setSchemes(schemesData.schemes);
        }
      } catch (schemeErr) {
        console.error('Failed to fetch schemes', schemeErr);
      } finally {
        setIsLoadingSchemes(false);
      }

    } catch (err) {
      setError(err.message || 'An error occurred while analyzing the document.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleNavigate = (pageId) => {
    setSidebarOpen(false);
    if (pageId === 'home' || pageId === 'upload') {
      setActivePage(pageId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (analysisResult) {
      setActivePage(pageId);
      if (pageId === 'explain') setActiveTab('explanation');
      if (pageId === 'next-steps') setActiveTab('next-steps');
      if (pageId === 'schemes') setActiveTab('schemes');
      if (pageId === 'draft') setActiveTab('draft-reply');
      const tabsEl = document.getElementById('results-section');
      if (tabsEl) tabsEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      setActivePage('upload');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    const pageByTab = {
      explanation: 'explain',
      'next-steps': 'next-steps',
      schemes: 'schemes',
      'draft-reply': 'draft',
    };
    setActivePage(pageByTab[tabId] || 'home');
  };

  return (
    <div className="flex min-h-screen bg-[#f6f8fb] font-sans text-navy-900">
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-navy-950/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={`fixed inset-y-0 left-0 z-40 w-72 transform transition-transform duration-300 ease-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:static lg:translate-x-0`}>
        <Sidebar activePage={activePage} onNavigate={handleNavigate} />
      </div>

      <div className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden">
        <div className="flex shrink-0 items-center border-b border-white/70 bg-white/90 px-4 py-3 shadow-sm backdrop-blur lg:hidden">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="mr-3 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-navy-100 text-navy-700 transition hover:bg-navy-50"
            aria-label="Toggle navigation"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <h1 className="text-lg font-bold text-navy-900">Sarkari Saathi</h1>
        </div>

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-6xl px-4 py-5 pb-12 sm:px-6 lg:px-8 lg:py-8">
            
            {error && (
              <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 shadow-sm">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-sm">!</div>
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold">Error</h4>
                  <p className="text-sm">{error}</p>
                </div>
                <button
                  onClick={() => setError(null)}
                  className="ml-auto rounded-md p-1 text-red-500 transition hover:bg-red-100 hover:text-red-700"
                  aria-label="Dismiss error"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <Header language={language} />
            
            <UploadSection 
              language={language} 
              onLanguageChange={setLanguage}
              onAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing}
            />

            {analysisResult && (
              <div id="results-section" className="animate-slide-up">
                <DocumentSummary analysis={analysisResult.analysis} />
                
                <div className="overflow-hidden rounded-lg border border-navy-100 bg-white shadow-premium">
                  <TabsSection 
                    activeTab={activeTab}
                    onTabChange={handleTabChange}
                    analysisResult={analysisResult}
                    schemes={schemes}
                    isLoadingSchemes={isLoadingSchemes}
                    draftReply={draftReply}
                    onDraftChange={setDraftReply}
                    language={language}
                  />
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
