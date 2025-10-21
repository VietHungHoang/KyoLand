import React from 'react';
import type { Topic } from '../types';
import { PlusIcon, DocumentTextIcon, CalendarDaysIcon, TrashIcon } from './icons/Icons';

interface VocabularyViewProps {
  topics: Topic[];
  onOpenCreateTopicModal: () => void;
  onDeleteTopic: (topicId: string) => void;
  onSelectTopic: (topicId: string) => void;
}

const VocabularyView: React.FC<VocabularyViewProps> = ({ topics, onOpenCreateTopicModal, onDeleteTopic, onSelectTopic }) => {

  return (
    <div className="bg-surface rounded-xl shadow-sm border border-stroke p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-onSurface">
          Vocabulary Topics
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
        Browse through different topics to expand your vocabulary. Click on a topic to start learning.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic) => (
          <div 
            key={topic.id}
            onClick={() => onSelectTopic(topic.id)}
            className="bg-background border border-stroke rounded-lg p-6 flex flex-col text-center hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer relative group"
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
            <div className="p-4 bg-primary/10 text-primary rounded-full mb-4 mx-auto">
              {React.cloneElement(topic.icon as React.ReactElement, { className: 'w-8 h-8' })}
            </div>
            <h3 className="text-2xl font-semibold text-onSurface">{topic.name}</h3>
            <p className="text-lg text-onSurfaceSecondary mt-1 flex-grow">
              Learn words related to {topic.name.toLowerCase()}.
            </p>
            <div className="border-t border-stroke w-full mt-4 pt-4 flex justify-around text-base text-onSurfaceSecondary">
              <div className="flex items-center">
                <DocumentTextIcon className="w-4 h-4 mr-1.5" />
                <span>{topic.wordCount} words</span>
              </div>
              <div className="flex items-center">
                <CalendarDaysIcon className="w-4 h-4 mr-1.5" />
                <span>{topic.createdAt}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VocabularyView;