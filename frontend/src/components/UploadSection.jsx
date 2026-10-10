import React, { useEffect, useRef, useState } from 'react';
import { Camera, FileText, Globe, Loader2, Mic, MicOff, ShieldCheck, Upload, X } from 'lucide-react';
import { sendVoiceQuestion } from '../services/api';

const languages = [
  'Hindi', 'English', 'Bhojpuri', 'Bengali', 'Tamil', 'Telugu',
  'Marathi', 'Gujarati', 'Kannada', 'Malayalam', 'Punjabi', 'Urdu', 'Odia'
];

const UploadSection = ({ language, onLanguageChange, onAnalyze, isAnalyzing }) => {
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [voiceError, setVoiceError] = useState(null);

  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current?.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const selectFile = (selectedFile) => {
    if (!selectedFile) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);

    setFile(selectedFile);
    setPreviewUrl(selectedFile.type.startsWith('image/') ? URL.createObjectURL(selectedFile) : null);
  };

  const handleFileChange = (event) => {
    selectFile(event.target.files?.[0]);
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragOver(false);
    selectFile(event.dataTransfer.files?.[0]);
  };

  const startRecording = async () => {
    setVoiceError(null);
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      setVoiceError('Voice input is not supported in this browser.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        try {
          const response = await sendVoiceQuestion(audioBlob, language);
          if (response?.question) setQuestion(response.question);
        } catch (error) {
          setVoiceError(error.message || 'Could not process voice input.');
        } finally {
          stream.getTracks().forEach((track) => track.stop());
        }
      };

      recorder.start();
      setIsRecording(true);
    } catch (error) {
      setVoiceError('Microphone access is required for voice input.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) stopRecording();
    else startRecording();
  };

  return (
    <section className="card-premium overflow-hidden">
      <div className="flex flex-col gap-4 border-b border-navy-100 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
            <Upload className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-navy-950">Upload Your Document</h2>
            <p className="text-xs font-medium text-navy-400">PDF, JPG, JPEG, and PNG supported</p>
          </div>
        </div>
        <div className="inline-flex items-center gap-2 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
          <ShieldCheck className="h-4 w-4" />
          Private until you submit
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 p-5 lg:grid-cols-[1.1fr_0.9fr] lg:p-6">
        <div className="min-w-0">
          {!file ? (
            <button
              type="button"
              className={`upload-zone flex min-h-[300px] w-full flex-col items-center justify-center rounded-lg border border-dashed border-navy-200 p-6 text-center ${isDragOver ? 'drag-over' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-navy-900 text-white shadow-premium">
                <Upload className="h-6 w-6" />
              </span>
              <span className="text-base font-bold text-navy-950">Drop your document here</span>
              <span className="mt-1 text-sm text-navy-500">or click to browse from your device</span>
              <span className="mt-4 rounded-lg border border-navy-100 bg-white px-3 py-1.5 text-xs font-semibold text-navy-500">
                Max clarity: upload a straight, well-lit photo
              </span>
            </button>
          ) : (
            <div className="flex min-h-[300px] flex-col rounded-lg border border-navy-100 bg-navy-50/60 p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase text-navy-400">Selected document</p>
                  <p className="truncate text-sm font-bold text-navy-950">{file.name}</p>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-red-100 bg-white text-red-500 transition hover:bg-red-50"
                  aria-label="Remove selected file"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex flex-1 items-center justify-center rounded-lg border border-white bg-white p-4 shadow-inner">
                {previewUrl ? (
                  <img src={previewUrl} alt="Selected document preview" className="max-h-56 w-full object-contain" />
                ) : (
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                      <FileText className="h-8 w-8" />
                    </div>
                    <p className="text-sm font-semibold text-navy-800">Document ready for analysis</p>
                    <p className="mt-1 text-xs text-navy-400">{file.type || 'File selected'}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept=".pdf,image/*"
          />
        </div>

        <div className="flex min-w-0 flex-col gap-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="btn-ghost inline-flex items-center gap-2 px-4 py-2.5 text-sm"
            >
              <Camera className="h-4 w-4" />
              Scan Document
            </button>

            {isRecording && (
              <span className="inline-flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">
                <span className="h-2 w-2 rounded-full bg-red-500"></span>
                Recording...
              </span>
            )}
          </div>

          <div>
            <label htmlFor="question" className="mb-2 block text-sm font-semibold text-navy-800">
              Ask a question, optional
            </label>
            <div className="relative">
              <textarea
                id="question"
                className="min-h-[120px] w-full resize-none rounded-lg border border-navy-100 bg-white p-4 pr-14 text-sm leading-6 text-navy-800 shadow-inner transition focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                placeholder="Example: What should I do before the deadline?"
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
              />
              <button
                type="button"
                onClick={toggleRecording}
                className={`absolute bottom-3 right-3 inline-flex h-10 w-10 items-center justify-center rounded-lg transition ${
                  isRecording
                    ? 'bg-red-500 text-white shadow-md shadow-red-500/20'
                    : 'border border-navy-100 bg-navy-50 text-navy-600 hover:bg-navy-100'
                }`}
                aria-label={isRecording ? 'Stop recording' : 'Start voice input'}
              >
                {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </button>
            </div>
            {voiceError && <p className="mt-2 text-sm font-medium text-red-600">{voiceError}</p>}
          </div>

          <div>
            <label htmlFor="language" className="mb-2 flex items-center gap-2 text-sm font-semibold text-navy-800">
              <Globe className="h-4 w-4 text-blue-600" />
              Response Language
            </label>
            <div className="relative">
              <select
                id="language"
                value={language}
                onChange={(event) => onLanguageChange?.(event.target.value)}
                className="w-full cursor-pointer appearance-none rounded-lg border border-navy-100 bg-white px-4 py-3 text-sm font-semibold text-navy-800 shadow-sm transition focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-navy-400">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onAnalyze(file, question)}
            disabled={!file || isAnalyzing}
            className={`btn-primary inline-flex w-full items-center justify-center gap-2 px-5 py-3.5 text-base ${
              (!file || isAnalyzing) ? 'cursor-not-allowed opacity-50' : 'hover:-translate-y-0.5'
            }`}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Analyzing your document...
              </>
            ) : (
              <>
                <FileText className="h-5 w-5" />
                Analyze Document
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};

export default UploadSection;
