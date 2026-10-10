import React, { useEffect, useState } from 'react';
import { Check, Copy, Download, Loader2, PenLine, Volume2, VolumeX } from 'lucide-react';
import { getAudio } from '../services/api';

const DraftReplyTab = ({ draftReply, onDraftChange, language }) => {
  const [audioUrl, setAudioUrl] = useState(null);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [audioError, setAudioError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const handleCopy = async () => {
    if (!draftReply) return;
    try {
      await navigator.clipboard.writeText(draftReply);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      setCopied(false);
    }
  };

  const handleListen = async () => {
    if (audioUrl || !draftReply) return;
    setIsLoadingAudio(true);
    setAudioError(null);
    try {
      const url = await getAudio(draftReply, language);
      setAudioUrl(url);
    } catch (err) {
      setAudioError('Could not load audio. Please try again later.');
    } finally {
      setIsLoadingAudio(false);
    }
  };

  const handleDownload = () => {
    if (!draftReply) return;
    const blob = new Blob([draftReply], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'draft_reply.txt';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  if (!draftReply) {
    return (
      <div className="rounded-lg border border-navy-100 bg-navy-50 p-10 text-center text-sm font-semibold text-navy-500">
        No draft reply generated.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-[#b85f00]">
            <PenLine className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-navy-950">Draft Reply / Application</h3>
            <p className="text-sm text-navy-500">Edit before submitting anywhere official</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="btn-ghost inline-flex items-center gap-2 px-3 py-2 text-sm"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button
            type="button"
            onClick={handleListen}
            disabled={isLoadingAudio}
            className="btn-ghost inline-flex items-center gap-2 px-3 py-2 text-sm"
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

      <textarea
        value={draftReply}
        onChange={(event) => onDraftChange(event.target.value)}
        className="min-h-[340px] w-full resize-y rounded-lg border border-navy-100 bg-white p-5 font-mono text-sm leading-7 text-navy-800 shadow-inner outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10"
        placeholder="Your draft reply..."
      />

      <p className="mt-3 text-right text-xs font-medium text-navy-400">
        Review names, amounts, dates, and office address before sending.
      </p>
    </div>
  );
};

export default DraftReplyTab;
