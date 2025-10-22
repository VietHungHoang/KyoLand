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
  analysis?: string;
}

export interface Topic {
  id: string;
  name:string;
  icon: string;
  wordCount?: number;
  createdAt?: string;
  words?: VocabularyWord[];
}

export interface SidebarSection {
  title: string;
  topics: Topic[];
}