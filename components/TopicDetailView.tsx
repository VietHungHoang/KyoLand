import React, { useState } from 'react';
import type { Topic, Synonym } from '../types';
import { PlusIcon, VolumeUpIcon, SparklesIcon, XIcon } from './icons/Icons';

interface TopicDetailViewProps {
  topic: Topic;
  onOpenAddWordManuallyModal: () => void;
}

const TopicDetailView: React.FC<TopicDetailViewProps> = ({ topic, onOpenAddWordManuallyModal }) => {
  const words = topic.words || [];
  const [comparingSynonym, setComparingSynonym] = useState<Synonym | null>(null);
  const [activeWordId, setActiveWordId] = useState<string | null>(null);

  const handleSynonymClick = (wordId: string, synonym: Synonym) => {
    if (activeWordId === wordId && comparingSynonym?.word === synonym.word) {
      setComparingSynonym(null);
      setActiveWordId(null);
    } else {
      setComparingSynonym(synonym);
      setActiveWordId(wordId);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-onSurface">
          {topic.name}
        </h1>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => alert('AI modal will be opened here!')}
            className="flex items-center justify-center bg-secondary text-onPrimary px-4 py-2 rounded-lg text-base font-semibold hover:opacity-90 transition-opacity duration-200"
          >
            <SparklesIcon className="w-5 h-5 mr-2" />
            Add with AI
          </button>
          <button 
            onClick={onOpenAddWordManuallyModal}
            className="flex items-center justify-center bg-primary text-onPrimary px-4 py-2 rounded-lg text-base font-semibold hover:bg-primary-dark transition-colors duration-200"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Manually
          </button>
        </div>
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
                  <h4 className="text-base font-semibold text-onSurfaceSecondary mb-1">Nghĩa tiếng Việt</h4>
                  <p className="text-lg text-onSurface">{word.vietnameseMeaning}</p>
                </div>
                 <div>
                  <h4 className="text-base font-semibold text-onSurfaceSecondary mb-1">Định nghĩa</h4>
                  <p className="text-lg text-onSurface">{word.definition}</p>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-base font-semibold text-onSurfaceSecondary mb-1">Example</h4>
                <p className="text-lg text-onSurface italic">"{word.example}"</p>
              </div>

              {word.notes && (
                <div className="mt-4 border-t border-stroke pt-4">
                  <h4 className="text-base font-semibold text-onSurfaceSecondary mb-1">Ghi chú</h4>
                  <p className="text-lg text-onSurface">{word.notes}</p>
                </div>
              )}

              {word.synonyms && word.synonyms.length > 0 && (
                <div className="mt-4 border-t border-stroke pt-4">
                  <h4 className="text-base font-semibold text-onSurfaceSecondary mb-2">Từ đồng nghĩa & Liên quan</h4>
                  <div className="flex flex-wrap gap-2">
                    {word.synonyms.map((synonym) => (
                      <button 
                        key={synonym.word}
                        onClick={() => handleSynonymClick(word.id, synonym)}
                        className={`text-sm font-medium px-2.5 py-1 rounded-full transition-colors ${
                            activeWordId === word.id && comparingSynonym?.word === synonym.word
                            ? 'bg-primary text-onPrimary'
                            : 'bg-gray-100 hover:bg-gray-200 text-onSurfaceSecondary'
                        }`}
                      >
                        {synonym.word}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {activeWordId === word.id && comparingSynonym && (
                 <div className="mt-4 bg-primary/5 border-l-4 border-primary/50 p-4 rounded-r-lg">
                    <div className="flex justify-between items-center mb-2">
                        <h5 className="font-bold text-lg text-primary">
                            So sánh: <span className="font-mono text-primary-dark">{word.word}</span> vs <span className="font-mono text-primary-dark">{comparingSynonym.word}</span>
                        </h5>
                        <button onClick={() => setComparingSynonym(null)} className="p-1 rounded-full hover:bg-primary/10">
                            <XIcon className="w-4 h-4 text-primary"/>
                        </button>
                    </div>
                    <p className="text-onSurface">{comparingSynonym.comparison}</p>
                 </div>
              )}

            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-surface border border-dashed border-stroke rounded-lg">
            <h3 className="text-2xl font-semibold text-onSurface">No words yet!</h3>
            <p className="text-lg text-onSurfaceSecondary mt-2">Click "Add Manually" to start building your word list for this topic.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicDetailView;