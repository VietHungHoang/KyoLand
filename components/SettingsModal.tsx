import React, { useState, useEffect } from 'react';
import { XIcon } from './icons/Icons';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (apiKey: string) => void;
  currentApiKey: string;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSave, currentApiKey }) => {
  const [apiKey, setApiKey] = useState(currentApiKey);

  useEffect(() => {
    setApiKey(currentApiKey);
  }, [currentApiKey, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(apiKey);
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div 
        className="bg-surface rounded-xl shadow-2xl p-8 w-full max-w-md relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-onSurfaceSecondary hover:text-onSurface transition-colors"
          aria-label="Close"
        >
          <XIcon className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-onSurface mb-6">Settings</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="apiKey" className="block text-sm font-medium text-onSurfaceSecondary mb-2">
              Gemini API Key
            </label>
            <input
              type="password"
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-stroke rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition"
              placeholder="Enter your API key"
              required
            />
             <p className="text-xs text-onSurfaceSecondary mt-1">
                Your API key is stored locally in your browser.
            </p>
          </div>
          
          <div className="flex justify-end space-x-4 mt-8">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-base font-semibold text-onSurfaceSecondary hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-4 py-2 rounded-lg text-base font-semibold bg-primary text-onPrimary hover:bg-primary-dark transition-colors"
            >
              Save Key
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsModal;