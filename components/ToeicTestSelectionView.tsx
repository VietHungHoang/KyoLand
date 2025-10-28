import React from 'react';

const ToeicTestSelectionView: React.FC<{ partNumber: number; onSelectTest: (test: number) => void }> = ({ partNumber, onSelectTest }) => {
  const tests = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div className="bg-surface rounded-xl shadow-sm border border-stroke p-8">
      <h1 className="text-4xl font-bold text-onSurface mb-2">Part {partNumber} - Select a Test</h1>
      <p className="text-onSurfaceSecondary text-xl mb-8">Choose which test you'd like to attempt.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {tests.map(testNumber => (
          <button
            key={testNumber}
            onClick={() => onSelectTest(testNumber)}
            className="flex flex-col items-center justify-center bg-background border border-stroke rounded-lg p-6 aspect-square hover:shadow-lg hover:-translate-y-1 hover:border-primary transition-all duration-200"
          >
            <span className="text-onSurfaceSecondary text-sm">Test</span>
            <span className="text-5xl font-bold text-primary">{testNumber}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ToeicTestSelectionView;
