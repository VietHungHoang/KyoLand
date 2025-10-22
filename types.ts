import type React from 'react';

export interface Synonym {
  word: string;
  comparison: string;
}

export interface VocabularyWord {
  id: string;
  word: string;
  phonetic: string;
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb' | 'preposition';
  vietnameseMeaning: string;
  definition: string;
  example: string;
  notes?: string;
  synonyms?: Synonym[];
}

export interface Topic {
  id: string;
  name:string;
  // FIX: Made icon type more specific to allow cloning with a className prop.
  icon: React.ReactElement<{ className?: string }>;
  wordCount?: number;
  createdAt?: string;
  words?: VocabularyWord[];
}

export interface SidebarSection {
  title: string;
  topics: Topic[];
}
