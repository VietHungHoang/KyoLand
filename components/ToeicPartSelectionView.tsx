import React from 'react';

const ToeicPartSelectionView: React.FC<{ onSelectPart: (part: number) => void }> = ({ onSelectPart }) => {
  const parts = [
    { number: 1, name: 'Photographs', description: 'Listen and choose the best description.' },
    { number: 2, name: 'Question-Response', description: 'Listen to a question and choose the best response.' },
    { number: 3, name: 'Conversations', description: 'Listen to conversations and answer questions.' },
    { number: 4, name: 'Talks', description: 'Listen to talks and answer questions.' },
    { number: 5, name: 'Incomplete Sentences', description: 'Choose the best word to complete sentences.' },
    { number: 6, name: 'Text Completion', description: 'Read texts and choose the best words.' },
    { number: 7, name: 'Reading Comprehension', description: 'Read passages and answer questions.' },
  ];

  return (
    <div className="max-w-3xl mx-auto bg-surface rounded-xl shadow-sm border border-stroke p-8">
      <h1 className="text-4xl font-bold text-onSurface mb-2">Select a Part</h1>
      <p className="text-onSurfaceSecondary text-xl mb-8">Choose which part of the TOEIC test you want to practice.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {parts.map(part => (
          <button
            key={part.number}
            onClick={() => onSelectPart(part.number)}
            className="bg-background border border-stroke rounded-lg p-6 text-center hover:shadow-md hover:-translate-y-1 transition-all duration-200"
          >
            <div className="text-5xl font-bold text-primary mb-2">{part.number}</div>
            <h3 className="text-xl font-semibold text-onSurface">{part.name}</h3>
            <p className="text-onSurfaceSecondary text-sm mt-1">{part.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ToeicPartSelectionView;