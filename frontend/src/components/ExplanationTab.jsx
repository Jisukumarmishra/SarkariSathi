import React, { useEffect, useState } from 'react';
import { AlertTriangle, Download, Loader2, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { getAudio } from '../services/api';

const ExplanationTab = ({ explanation, disclaimer, language }) => {
  const [audioUrl, setAudioUrl] = useState(null);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [audioError, setAudioError] = useState(null);

  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const handleListen = async () => {
    if (audioUrl || !explanation) return;
    setIsLoadingAudio(true);
    setAudioError(null);
    try {
      const url = await getAudio(explanation, language);
      setAudioUrl(url);
    } catch (err) {
      setAudioError('Could not load audio. Please try again later.');
    } finally {
      setIsLoadingAudio(false);
    }
  };

  const handleDownload = () => {
    const textToDownload = `${explanation}\n\nDisclaimer: ${disclaimer}`;
    const blob = new Blob([textToDownload], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'explanation.txt';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  if (!explanation) {
    return (
      <div className="rounded-lg border border-navy-100 bg-navy-50 p-10 text-center text-sm font-semibold text-navy-500">
        No explanation generated.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-navy-950">Simple Explanation</h3>
            <p className="text-sm text-navy-500">Plain language summary in {language}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleListen}
            disabled={isLoadingAudio}
            className="btn-ghost inline-flex items-center gap-2 px-4 py-2 text-sm"
          >
            {isLoadingAudio ? <Loader2 className="h-4 w-4 animate-spin" /> : <Volume2 className="h-4 w-4" />}
            Listen
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="btn-primary inline-flex items-center gap-2 px-4 py-2 text-sm"
          >
            <Download className="h-4 w-4" />
            Save
          </button>
        </div>
      </div>

      {audioUrl && (
        <div className="mb-4 rounded-lg border border-blue-100 bg-blue-50 p-3">
          <audio src={audioUrl} controls autoPlay className="h-10 w-full" />
        </div>
      )}

      {audioError && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 p-3 text-sm font-medium text-red-600">
          <VolumeX className="h-4 w-4" />
          {audioError}
        </div>
      )}

      <div className="rounded-lg border border-navy-100 bg-white p-5 text-[15px] leading-7 text-navy-700 shadow-inner whitespace-pre-wrap">
        {explanation}
      </div>

      {disclaimer && (
        <div className="mt-4 flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <p className="text-sm leading-6 text-amber-800">{disclaimer}</p>
        </div>
      )}
    </div>
  );
};

export default ExplanationTab;
