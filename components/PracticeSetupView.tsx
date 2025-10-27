import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import type { Topic, VocabularyWord, QuizQuestion } from '../types';
import { AcademicCapIcon } from './icons/Icons';

interface PracticeSetupViewProps {
  topic: Topic;
  apiKey: string;
  onStartQuiz: (quizData: { questions: QuizQuestion[], words: VocabularyWord[] }) => void;
  onBack: () => void;
}

const PracticeSetupView: React.FC<PracticeSetupViewProps> = ({ topic, apiKey, onStartQuiz, onBack }) => {
  const [selectedWordIds, setSelectedWordIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const words = topic.words || [];

  const handleToggleWord = (wordId: string) => {
    setSelectedWordIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(wordId)) {
        newSet.delete(wordId);
      } else {
        newSet.add(wordId);
      }
      return newSet;
    });
  };

  const handleGenerateQuiz = async () => {
    setError(null);
    if (!apiKey) {
      setError("Please set your Gemini API key in the settings before generating a quiz.");
      return;
    }
    
    if (words.length < 10) {
      setError(`This topic only has ${words.length} words. You need at least 10 words to generate a quiz.`);
      return;
    }

    setIsLoading(true);

    let finalWords: VocabularyWord[] = [];
    let selectedWords = words.filter(w => selectedWordIds.has(w.id));
    finalWords.push(...selectedWords);

    if (finalWords.length < 10) {
      const needed = 10 - finalWords.length;
      const unselectedWords = words
        .filter(w => !selectedWordIds.has(w.id))
        .sort((a, b) => a.practiceCount - b.practiceCount); // Prioritize least practiced
      
      finalWords.push(...unselectedWords.slice(0, needed));
    }

    const wordsForPrompt = finalWords.map(w => w.word);
    
    const prompt = `
      You are an English teacher creating a quiz for a student learning vocabulary. The quiz should be similar in style and difficulty to the TOEIC Part 5 test (sentence completion).
      You will be given a list of 10 vocabulary words. Your task is to generate 10 multiple-choice questions.

      **Rules:**
      1.  **One Word, One Question:** Each of the 10 provided words must be the correct answer for exactly one of the 10 questions.
      2.  **Random Order:** The order of the questions should not correspond to the order of the words provided. The correct answers should be distributed randomly among the questions.
      3.  **Four Options:** Each question must have four options (A, B, C, D). One option is the correct answer, and the other three are distractors.
      4.  **Plausible Distractors:** The three incorrect options (distractors) must be grammatically and semantically plausible for the sentence, but incorrect in the given context. Distractors can be other words from the provided list or other relevant words. All options for a given question should ideally be the same part of speech.
      5.  **Strict JSON Output:** Your response must be a single, valid JSON object. Do not include any text, markdown, or explanations outside of the JSON block. The JSON object should be an array of question objects.

      Here are the 10 vocabulary words to use as correct answers:
      ---
      ${JSON.stringify(wordsForPrompt)}
      ---

      Generate the JSON array of 10 quiz questions now.
    `;
    
    const responseSchema = {
      type: Type.ARRAY,
      items: {
          type: Type.OBJECT,
          properties: {
              question: { type: Type.STRING, description: 'The quiz question sentence with a blank.' },
              options: {
                  type: Type.ARRAY,
                  description: 'An array of four string options.',
                  items: { type: Type.STRING }
              },
              answer: { type: Type.STRING, description: 'The correct answer word from the options.' }
          },
          required: ['question', 'options', 'answer']
      }
    };
    
    try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });
        
        const questions = JSON.parse(response.text);
        onStartQuiz({ questions, words: finalWords });

    } catch (err) {
        console.error("Error generating quiz:", err);
        setError("Failed to generate the quiz. The AI might be unavailable or there was an issue with the request. Please try again.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="bg-surface rounded-xl shadow-sm border border-stroke p-8">
      <h1 className="text-3xl font-bold text-onSurface mb-2">Practice Setup: {topic.name}</h1>
      <p className="text-lg text-onSurfaceSecondary mb-6">Select words to include in your quiz. If you select fewer than 10, the system will add the least-practiced words for you.</p>

      <div className="mb-6 max-h-[40vh] overflow-y-auto border border-stroke rounded-lg p-2 bg-background">
        <table className="w-full text-left">
          <thead className="sticky top-0 bg-background">
            <tr>
              <th className="p-3 w-12"></th>
              <th className="p-3 text-base font-semibold text-onSurfaceSecondary">Word</th>
              <th className="p-3 text-base font-semibold text-onSurfaceSecondary">Meaning</th>
              <th className="p-3 text-base font-semibold text-onSurfaceSecondary">Practiced</th>
            </tr>
          </thead>
          <tbody>
            {words.map(word => (
              <tr 
                key={word.id} 
                className="border-t border-stroke hover:bg-surface transition-colors cursor-pointer"
                onClick={() => handleToggleWord(word.id)}
              >
                <td className="p-3 text-center">
                  <input
                    type="checkbox"
                    checked={selectedWordIds.has(word.id)}
                    onChange={() => {}} // Click is handled by tr
                    className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </td>
                <td className="p-3 text-lg font-semibold text-primary">{word.word}</td>
                <td className="p-3 text-base text-onSurface">{word.vietnameseMeaning}</td>
                <td className="p-3 text-base text-onSurfaceSecondary">{word.practiceCount} times</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {error && (
        <p className="text-red-600 text-sm mb-4">{error}</p>
      )}

      <div className="flex justify-end items-center">
        <span className="mr-4 text-onSurfaceSecondary">{selectedWordIds.size} words selected</span>
        <button
          onClick={handleGenerateQuiz}
          disabled={isLoading || words.length < 10}
          className="flex items-center justify-center bg-primary text-onPrimary px-6 py-3 rounded-lg text-base font-semibold hover:bg-primary-dark transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px]"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating Quiz...
            </>
          ) : (
             <>
               <AcademicCapIcon className="w-5 h-5 mr-2" />
               Generate Quiz
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PracticeSetupView;
