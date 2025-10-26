import React, { useState } from 'react';
import { SearchIcon, VolumeUpIcon } from './icons/Icons';

interface Definition {
  definition: string;
  example?: string;
}

interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
  synonyms: string[];
  antonyms: string[];
}

interface Phonetic {
    text: string;
    audio: string;
}

interface ApiWordData {
  word: string;
  phonetic: string;
  phonetics: Phonetic[];
  meanings: Meaning[];
}

const VocabularyApiView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ApiWordData | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${searchTerm.trim()}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Sorry, we couldn't find definitions for the word you were looking for.`);
        }
        throw new Error('An unexpected error occurred. Please try again later.');
      }
      const data = await response.json();
      setResult(data[0]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const playAudio = (audioUrl: string) => {
    if (audioUrl) {
        new Audio(audioUrl).play();
    }
  }

  const findFirstAudioUrl = (): string | undefined => {
      return result?.phonetics?.find(p => p.audio)?.audio;
  }

  return (
    <div className="bg-surface rounded-xl shadow-sm border border-stroke p-8">
      <h1 className="text-4xl font-bold text-onSurface mb-2">
        Live Dictionary Search
      </h1>
      <p className="text-onSurfaceSecondary text-xl mb-6">
        Look up any English word using the Free Dictionary API.
      </p>

      <form onSubmit={handleSearch} className="flex items-center mb-8">
        <div className="relative flex-grow">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-onSurfaceSecondary" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter a word to look up, e.g., 'serendipity'"
            className="w-full pl-12 pr-4 py-3 bg-background border border-stroke rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition text-lg"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="ml-4 px-6 py-3 bg-primary text-onPrimary rounded-lg text-lg font-semibold hover:bg-primary-dark transition-colors disabled:bg-primary/50 disabled:cursor-wait"
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {isLoading && (
        <div className="flex justify-center items-center py-10">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="ml-4 text-lg text-onSurfaceSecondary">Looking up your word...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg">
          <h4 className="font-bold">Error</h4>
          <p>{error}</p>
        </div>
      )}
      
      {!isLoading && !error && !result && (
        <div className="text-center py-12 border border-dashed border-stroke rounded-lg">
            <h3 className="text-2xl font-semibold text-onSurface">Ready to Search</h3>
            <p className="text-lg text-onSurfaceSecondary mt-2">Enter a word above to see its definition, phonetics, and more.</p>
        </div>
      )}

      {result && (
        <div className="space-y-6">
            <div className="bg-background border border-stroke rounded-lg p-6">
              <div className="flex items-center mb-3">
                <h2 className="text-4xl font-bold text-primary mr-3">{result.word}</h2>
                {findFirstAudioUrl() && (
                    <button 
                        onClick={() => playAudio(findFirstAudioUrl()!)}
                        className="text-onSurfaceSecondary hover:text-primary transition-colors"
                        title={`Listen to "${result.word}"`}
                    >
                        <VolumeUpIcon className="w-7 h-7" />
                    </button>
                )}
                <span className="text-2xl text-onSurfaceSecondary ml-4 italic">{result.phonetic}</span>
              </div>
            </div>

          {result.meanings.map((meaning, index) => (
            <div key={index} className="bg-background border border-stroke rounded-lg p-6">
              <h3 className="text-2xl font-semibold text-onSurface mb-4 capitalize italic">{meaning.partOfSpeech}</h3>
              <div className="space-y-4">
                {meaning.definitions.map((def, defIndex) => (
                  <div key={defIndex} className="border-l-4 border-primary/30 pl-4">
                    <p className="text-lg text-onSurface">{def.definition}</p>
                    {def.example && (
                      <p className="text-base text-onSurfaceSecondary italic mt-1">e.g., "{def.example}"</p>
                    )}
                  </div>
                ))}
              </div>
               {(meaning.synonyms.length > 0 || meaning.antonyms.length > 0) && (
                 <div className="mt-4 pt-4 border-t border-stroke/50 flex space-x-8">
                    {meaning.synonyms.length > 0 && (
                        <div>
                            <h4 className="font-semibold text-onSurfaceSecondary mb-1">Synonyms</h4>
                            <p className="text-onSurface">{meaning.synonyms.join(', ')}</p>
                        </div>
                    )}
                     {meaning.antonyms.length > 0 && (
                        <div>
                            <h4 className="font-semibold text-onSurfaceSecondary mb-1">Antonyms</h4>
                            <p className="text-onSurface">{meaning.antonyms.join(', ')}</p>
                        </div>
                    )}
                 </div>
               )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VocabularyApiView;
