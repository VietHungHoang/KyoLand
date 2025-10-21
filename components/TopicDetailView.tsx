import React from 'react';
import type { Topic } from '../types';
import { PlusIcon, VolumeUpIcon } from './icons/Icons';

interface TopicDetailViewProps {
  topic: Topic;
}

const TopicDetailView: React.FC<TopicDetailViewProps> = ({ topic }) => {
  const words = topic.words || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-onSurface">
          {topic.name}
        </h1>
        <button 
          onClick={() => alert('Add new word modal will be opened here!')}
          className="flex items-center justify-center bg-secondary text-onPrimary px-4 py-2 rounded-lg text-base font-semibold hover:opacity-90 transition-opacity duration-200"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Vocabulary
        </button>
      </div>

      <div className="space-y-4">
        {words.length > 0 ? (
          words.map((word) => (
            <div key={word.id} className="bg-surface border border-stroke rounded-lg p-6">
              <div className="flex items-center mb-3">
                <h2 className="text-3xl font-bold text-primary mr-3">{word.word}</h2>
                <button className="text-onSurfaceSecondary hover:text-primary transition-colors">
                  <VolumeUpIcon className="w-6 h-6" />
                </button>
                <span className="text-xl text-onSurfaceSecondary ml-4 italic">{word.phonetic}</span>
                <span className="ml-auto text-base font-medium bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">{word.partOfSpeech}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                <div>
                  <h4 className="text-base font-semibold text-onSurfaceSecondary mb-1">Vietnamese Meaning</h4>
                  <p className="text-lg text-onSurface">{word.vietnameseMeaning}</p>
                </div>
                 <div>
                  <h4 className="text-base font-semibold text-onSurfaceSecondary mb-1">Definition</h4>
                  <p className="text-lg text-onSurface">{word.definition}</p>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-base font-semibold text-onSurfaceSecondary mb-1">Example</h4>
                <p className="text-lg text-onSurface italic">"{word.example}"</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-surface border border-dashed border-stroke rounded-lg">
            <h3 className="text-2xl font-semibold text-onSurface">No words yet!</h3>
            <p className="text-lg text-onSurfaceSecondary mt-2">Click "Add Vocabulary" to start building your word list for this topic.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicDetailView;