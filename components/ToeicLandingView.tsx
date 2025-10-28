import React from 'react';
import { ChevronRightIcon } from './icons/Icons';

const ToeicLandingView: React.FC<{ onSelectSet: (set: string) => void }> = ({ onSelectSet }) => {
  const sets = [{ id: 'ETS2024', name: 'ETS 2024', description: 'Official practice tests for the 2024 season.' }];

  return (
    <div className="max-w-3xl mx-auto bg-surface rounded-xl shadow-sm border border-stroke p-8">
      <h1 className="text-4xl font-bold text-onSurface mb-2">TOEIC Test Sets</h1>
      <p className="text-onSurfaceSecondary text-xl mb-8">Choose a test set to begin your practice.</p>
      <div className="space-y-4">
        {sets.map(set => (
          <button
            key={set.id}
            onClick={() => onSelectSet(set.id)}
            className="w-full flex justify-between items-center bg-background border border-stroke rounded-lg p-6 text-left hover:bg-gray-50 hover:border-primary transition-all duration-200"
          >
            <div>
              <h3 className="text-2xl font-semibold text-primary">{set.name}</h3>
              <p className="text-onSurfaceSecondary text-base mt-1">{set.description}</p>
            </div>
            <ChevronRightIcon className="w-6 h-6 text-onSurfaceSecondary" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ToeicLandingView;