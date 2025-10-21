import type React from 'react';

export interface VocabularyWord {
  id: string;
  word: string;
  phonetic: string;
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb' | 'preposition';
  vietnameseMeaning: string;
  definition: string;
  example: string;
}

export interface Topic {
  id: string;
  name:string;
  icon: React.ReactNode;
  wordCount?: number;
  createdAt?: string;
  words?: VocabularyWord[];
}

export interface SidebarSection {
  title: string;
  topics: Topic[];
}
