import React, { useState } from 'react';
import { XIcon } from './icons/Icons';

interface CreateTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (topicName: string) => void;
}

const CreateTopicModal: React.FC<CreateTopicModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [topicName, setTopicName] = useState('');

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topicName.trim()) {
      onCreate(topicName.trim());
      setTopicName('');
    }
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

        <h2 className="text-2xl font-bold text-onSurface mb-6">Create New Vocabulary Topic</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="topicName" className="block text-sm font-medium text-onSurfaceSecondary mb-2">
              Topic Name
            </label>
            <input
              type="text"
              id="topicName"
              value={topicName}
              onChange={(e) => setTopicName(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-stroke rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition"
              placeholder="e.g., Business English"
              required
            />
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
              Save Topic
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTopicModal;