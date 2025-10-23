import React, { useState } from 'react';
import { XIcon, PlusIcon } from './icons/Icons';
import type { DictationTopic } from '../types';

interface CreateDictationTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (topicData: Omit<DictationTopic, 'id' | 'createdAt' | 'icon'>) => void;
}

const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const CreateDictationTopicModal: React.FC<CreateDictationTopicModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [topicName, setTopicName] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) {
    return null;
  }
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          setAudioFile(file);
          setError(null);
      }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicName.trim()) {
      setError("Please provide a topic name.");
      return;
    }
    if (!audioFile) {
      setError("Please upload an audio file.");
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    
    try {
        const audioDataUrl = await fileToDataUrl(audioFile);
        
        onCreate({
            name: topicName.trim(),
            audioDataUrl,
            audioFileName: audioFile.name,
            audioFileSize: audioFile.size,
            audioFileType: audioFile.type,
            status: 'new',
        });

        // Reset form
        setTopicName('');
        setAudioFile(null);
    } catch (err) {
        console.error("Error processing file", err);
        setError("Could not process the audio file. Please try another file.");
    } finally {
        setIsProcessing(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div 
        className="bg-surface rounded-xl shadow-2xl p-8 w-full max-w-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-onSurfaceSecondary hover:text-onSurface transition-colors"
          aria-label="Close"
        >
          <XIcon className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-onSurface mb-6">Create New Dictation Topic</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="dictationTopicName" className="block text-sm font-medium text-onSurfaceSecondary mb-2">
              Topic Name
            </label>
            <input
              type="text"
              id="dictationTopicName"
              value={topicName}
              onChange={(e) => setTopicName(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-stroke rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition"
              placeholder="e.g., TED Talk on Climate"
              required
            />
          </div>

           <div className="mb-4">
            <label className="block text-sm font-medium text-onSurfaceSecondary mb-2">
              Audio File
            </label>
            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-stroke px-6 py-10">
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-onSurfaceSecondary" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="mt-4 flex text-sm leading-6 text-onSurfaceSecondary">
                  <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-surface font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:text-primary-dark">
                    <span>Upload a file</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="audio/*" onChange={handleFileChange} />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                 {audioFile ? (
                    <p className="text-sm text-onSurface mt-2">{audioFile.name}</p>
                 ) : (
                    <p className="text-xs leading-5">MP3, WAV, M4A up to 10MB</p>
                 )}
              </div>
            </div>
            <p className='text-sm mt-4 text-onSurfaceSecondary'>For now, only file uploads are supported. URL imports from sources like Google Drive will be added in a future update.</p>
          </div>
          
          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
          
          <div className="flex justify-end space-x-4 mt-8">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-base font-semibold text-onSurfaceSecondary hover:bg-gray-100 transition-colors"
              disabled={isProcessing}
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-4 py-2 rounded-lg text-base font-semibold bg-primary text-onPrimary hover:bg-primary-dark transition-colors flex items-center"
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : <><PlusIcon className="w-5 h-5 mr-2" /> Create Topic</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDictationTopicModal;
