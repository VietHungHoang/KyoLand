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

export interface DictationTopic {
  id: string;
  name: string;
  icon: string;
  createdAt: string;
  audioFileName: string;
  audioFileSize: number;
  audioFileType: string;
  audioDataUrl?: string; 
  transcription?: string;
  status: 'new' | 'transcribing' | 'done' | 'error';
  errorMessage?: string;
}

export interface SidebarSection {
  title: string;
  topics: any[]; // Allow for different topic types, like Topic and static objects
}
