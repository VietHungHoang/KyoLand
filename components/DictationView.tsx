import React from 'react';
import type { DictationTopic } from '../types';
import { PlusIcon, CalendarDaysIcon, TrashIcon, Icon, DocumentTextIcon } from './icons/Icons';

interface DictationViewProps {
  topics: DictationTopic[];
  onOpenCreateTopicModal: () => void;
  onDeleteTopic: (topicId: string) => void;
  onSelectTopic: (topicId: string) => void;
}

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const getStatusBadgeColor = (status: DictationTopic['status']) => {
  switch (status) {
    case 'new':
      return 'bg-gray-100 text-gray-800';
    case 'transcribing':
      return 'bg-yellow-100 text-yellow-800 animate-pulse';
    case 'done':
      return 'bg-green-100 text-green-800';
    case 'error':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};


const DictationView: React.FC<DictationViewProps> = ({ topics, onOpenCreateTopicModal, onDeleteTopic, onSelectTopic }) => {

  return (
    <div className="bg-surface rounded-xl shadow-sm border border-stroke p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-onSurface">
          Dictation Topics
        </h1>
        <button 
          onClick={onOpenCreateTopicModal}
          className="flex items-center justify-center bg-primary text-onPrimary px-4 py-2 rounded-lg text-base font-semibold hover:bg-primary-dark transition-colors duration-200"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Create Topic
        </button>
      </div>
      <p className="text-onSurfaceSecondary text-xl mb-8">
        Create a topic, upload an audio file, and use AI to transcribe it for your practice.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic) => (
          <div 
            key={topic.id}
            onClick={() => onSelectTopic(topic.id)}
            className="bg-background border border-stroke rounded-lg p-6 flex flex-col hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer relative group"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteTopic(topic.id);
              }}
              className="absolute top-2 right-2 p-1.5 rounded-full text-onSurfaceSecondary opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-600 transition-all duration-200"
              aria-label={`Delete ${topic.name} topic`}
            >
              <TrashIcon className="w-5 h-5" />
            </button>
            <div className='flex items-center mb-4'>
                <div className="p-3 bg-primary/10 text-primary rounded-lg mr-4">
                    <Icon name={topic.icon} className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-xl font-semibold text-onSurface text-left">{topic.name}</h3>
                     <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getStatusBadgeColor(topic.status)}`}>
                        {topic.status.charAt(0).toUpperCase() + topic.status.slice(1)}
                    </span>
                </div>
            </div>
            
            <p className="text-base text-onSurfaceSecondary mt-1 flex-grow text-left">
              {topic.audioFileName}
            </p>

            <div className="border-t border-stroke w-full mt-4 pt-4 flex justify-around text-base text-onSurfaceSecondary">
              <div className="flex items-center">
                <DocumentTextIcon className="w-4 h-4 mr-1.5" />
                <span>{formatBytes(topic.audioFileSize)}</span>
              </div>
              <div className="flex items-center">
                <CalendarDaysIcon className="w-4 h-4 mr-1.5" />
                <span>{topic.createdAt}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
       {topics.length === 0 && (
          <div className="text-center py-12 col-span-full border border-dashed border-stroke rounded-lg">
            <h3 className="text-2xl font-semibold text-onSurface">No dictation topics yet!</h3>
            <p className="text-lg text-onSurfaceSecondary mt-2">Click "Create Topic" to start your first dictation exercise.</p>
          </div>
        )}
    </div>
  );
};

export default DictationView;
