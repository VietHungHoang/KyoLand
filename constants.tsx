import React from 'react';
import type { SidebarSection } from './types';

export const SIDEBAR_SECTIONS_INITIAL: SidebarSection[] = [
  {
    title: 'Vocabulary',
    topics: []
  },
  {
    title: 'Dictation',
    topics: [],
  },
  {
    title: 'Grammar',
    topics: [
      {
        id: 'tenses',
        name: 'Verb Tenses',
        icon: 'ClockIcon'
      },
      {
        id: 'conditionals',
        name: 'Conditionals',
        icon: 'BookOpenIcon'
      }
    ]
  }
];
