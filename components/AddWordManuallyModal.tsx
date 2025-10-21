import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { XIcon, SparklesIcon } from './icons/Icons';
import type { VocabularyWord } from '../types';

interface AddWordManuallyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWord: (word: VocabularyWord) => void;
  topicName: string;
}

const AddWordManuallyModal: React.FC<AddWordManuallyModalProps> = ({ isOpen, onClose, onAddWord, topicName }) => {
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) {
      setError("Please enter some information about the word.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (!process.env.API_KEY) {
        throw new Error("API key is not configured. Please contact support.");
      }

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      const prompt = `
        You are an expert English-Vietnamese lexicographer. Your task is to take a user's raw text input and transform it into a complete, structured vocabulary entry in JSON format.

        The user is learning English and will provide you with whatever information they know about a word. You must adhere to the following rules:
        1.  **Preserve User Input:** If the user provides specific information (like a definition, an example, or a Vietnamese meaning), you MUST use that exact information in the final JSON output. DO NOT modify or replace it.
        2.  **Complete Missing Information:** For any fields that are missing from the user's input, you must generate the correct information.
        3.  **Strict JSON Output:** The final output must be a single, valid JSON object that conforms to the specified schema. Do not include any text, markdown, or explanations outside of the JSON block.

        Here is the user's input for a word in the topic "${topicName}":
        ---
        ${userInput}
        ---

        Generate the JSON object based on this input.
      `;

      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          word: { type: Type.STRING, description: "The English vocabulary word." },
          phonetic: { type: Type.STRING, description: "The phonetic spelling (IPA)." },
          partOfSpeech: {
            type: Type.STRING,
            description: "The part of speech.",
            enum: ['noun', 'verb', 'adjective', 'adverb', 'preposition'],
          },
          vietnameseMeaning: { type: Type.STRING, description: "The Vietnamese translation." },
          definition: { type: Type.STRING, description: "A clear and concise definition in English." },
          example: { type: Type.STRING, description: "An example sentence using the word." },
          notes: { type: Type.STRING, description: "Optional notes about usage, context, or common mistakes." },
          synonyms: {
            type: Type.ARRAY,
            description: "An array of related words or synonyms.",
            items: {
              type: Type.OBJECT,
              properties: {
                word: { type: Type.STRING, description: "The synonym itself." },
                comparison: { type: Type.STRING, description: "A detailed comparison with the main word, explaining the nuanced differences in meaning or usage." }
              },
              required: ['word', 'comparison']
            }
          }
        },
        required: ['word', 'phonetic', 'partOfSpeech', 'vietnameseMeaning', 'definition', 'example']
      };

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: responseSchema,
        },
      });

      const resultJson = JSON.parse(response.text);
      const newWord: VocabularyWord = {
        id: `word-${Date.now()}`,
        ...resultJson,
      };

      onAddWord(newWord);
      setUserInput('');
      onClose();

    } catch (err) {
      console.error("Error generating word with AI:", err);
      setError("Failed to generate word. The AI might be unavailable, or the provided text was too ambiguous. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-surface rounded-xl shadow-2xl p-8 w-full max-w-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-onSurfaceSecondary hover:text-onSurface transition-colors"
          aria-label="Close"
        >
          <XIcon className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-onSurface mb-2">Add Word with AI Assistant</h2>
        <p className="text-onSurfaceSecondary mb-6">
          Enter any information you have. The AI will complete the rest for you.
          <br/>
          (e.g., "culinary", "culinary means related to cooking", "từ 'itinerary' nghĩa là gì")
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="wordInfo" className="sr-only">
              Word Information
            </label>
            <textarea
              id="wordInfo"
              rows={5}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-stroke rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition text-lg"
              placeholder="Enter a word, definition, example, or meaning..."
              disabled={isLoading}
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm mb-4">{error}</p>
          )}
          
          <div className="flex justify-end space-x-4 mt-8">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-base font-semibold text-onSurfaceSecondary hover:bg-gray-100 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-6 py-2 rounded-lg text-base font-semibold bg-primary text-onPrimary hover:bg-primary-dark transition-colors flex items-center justify-center min-w-[160px]"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <SparklesIcon className="w-5 h-5 mr-2" />
                  Generate & Add
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddWordManuallyModal;
