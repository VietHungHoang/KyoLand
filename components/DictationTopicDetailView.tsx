import React from 'react';
import { GoogleGenAI } from "@google/genai";
import type { DictationTopic } from '../types';
import { SparklesIcon } from './icons/Icons';

interface DictationTopicDetailViewProps {
  topic: DictationTopic;
  onUpdateTopic: (updatedTopic: DictationTopic) => void;
  apiKey: string;
}

const dataUrlToBase64 = (dataUrl: string) => {
  return dataUrl.substring(dataUrl.indexOf(',') + 1);
};

const DictationTopicDetailView: React.FC<DictationTopicDetailViewProps> = ({ topic, onUpdateTopic, apiKey }) => {
 
  const handleTranscribe = async () => {
    if (!apiKey) {
      onUpdateTopic({ ...topic, status: 'error', errorMessage: 'API Key not found. Please add your Gemini API key in settings.' });
      return;
    }

    if (!topic.audioDataUrl) {
      onUpdateTopic({ ...topic, status: 'error', errorMessage: 'Audio data is missing.' });
      return;
    }
    
    onUpdateTopic({ ...topic, status: 'transcribing', errorMessage: undefined });
    
    try {
      const ai = new GoogleGenAI({ apiKey });
      
      const audioData = dataUrlToBase64(topic.audioDataUrl);
      
      const audioPart = {
        inlineData: {
          mimeType: topic.audioFileType,
          data: audioData,
        },
      };
      
      const textPart = { text: "Transcribe the following audio recording accurately. The audio may contain speech on various topics." };

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: { parts: [audioPart, textPart] },
      });
      
      const transcription = response.text;
      onUpdateTopic({ ...topic, status: 'done', transcription });

    } catch (err: any) {
      console.error("Error transcribing audio:", err);
      onUpdateTopic({ ...topic, status: 'error', errorMessage: `Transcription failed: ${err.message}` });
    }
  };


  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-onSurface">
          {topic.name}
        </h1>
        <button 
            onClick={handleTranscribe}
            disabled={!apiKey || topic.status === 'transcribing'}
            className="flex items-center justify-center bg-secondary text-onPrimary px-4 py-2 rounded-lg text-base font-semibold transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
          >
            <SparklesIcon className="w-5 h-5 mr-2" />
            {topic.status === 'transcribing' 
              ? 'Transcribing...' 
              : topic.status === 'done' 
              ? 'Re-transcribe with AI' 
              : 'Transcribe with AI'}
          </button>
      </div>

      <div className="space-y-6">
        {topic.status === 'error' && (
             <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-md">
                <div className="flex">
                    <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                    </svg>
                    </div>
                    <div className="ml-3">
                    <p className="text-sm text-red-700">{topic.errorMessage}</p>
                    </div>
                </div>
            </div>
        )}

        <div className="bg-surface border border-stroke rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-onSurface mb-4">Transcription</h2>
            {topic.status === 'transcribing' && (
                <div className="flex flex-col items-center justify-center py-10">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-onSurfaceSecondary">AI is processing the audio, please wait...</p>
                </div>
            )}
            {topic.status === 'done' && topic.transcription && (
                <div className="prose prose-lg max-w-none text-onSurface whitespace-pre-wrap">
                    <p>{topic.transcription}</p>
                </div>
            )}
            {(topic.status === 'new' || topic.status === 'error') && (
                 <div className="text-center py-12 border border-dashed border-stroke rounded-lg">
                    <h3 className="text-xl font-semibold text-onSurface">Transcription not available</h3>
                    <p className="text-lg text-onSurfaceSecondary mt-2">Click "Transcribe with AI" to generate the text from your audio file.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default DictationTopicDetailView;