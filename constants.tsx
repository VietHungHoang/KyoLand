import React from 'react';
import type { SidebarSection } from './types';
import { 
  PlaneIcon, 
  FoodIcon, 
  BriefcaseIcon, 
  ChatBubbleIcon, 
  HomeIcon, 
  ShoppingCartIcon,
  ClockIcon,
  BookOpenIcon
} from './components/icons/Icons';

export const SIDEBAR_SECTIONS: SidebarSection[] = [
  {
    title: 'Vocabulary',
    topics: [
      {
        id: 'travel',
        name: 'Travel & Vacation',
        icon: <PlaneIcon className="w-5 h-5" />,
        wordCount: 52,
        createdAt: 'Oct 26, 2023',
        words: [
          {
            id: 'word-1',
            word: 'Destination',
            phonetic: '/ˌdes.təˈneɪ.ʃən/',
            partOfSpeech: 'noun',
            vietnameseMeaning: 'Điểm đến',
            definition: 'The place to which someone or something is going or being sent.',
            example: 'Our final destination is the sunny beaches of Hawaii.'
          },
          {
            id: 'word-2',
            word: 'Itinerary',
            phonetic: '/aɪˈtɪn.ə.rer.i/',
            partOfSpeech: 'noun',
            vietnameseMeaning: 'Lịch trình',
            definition: 'A planned route or journey.',
            example: 'The travel agent prepared a detailed itinerary for our trip to Italy.'
          },
          {
            id: 'word-3',
            word: 'Explore',
            phonetic: '/ɪkˈsplɔːr/',
            partOfSpeech: 'verb',
            vietnameseMeaning: 'Khám phá',
            definition: 'Travel through (an unfamiliar area) in order to learn about it.',
            example: 'We decided to explore the ancient ruins on our own.'
          }
        ]
      },
      {
        id: 'food',
        name: 'Food & Dining',
        icon: <FoodIcon className="w-5 h-5" />,
        wordCount: 78,
        createdAt: 'Oct 22, 2023',
        words: [],
      },
      {
        id: 'work',
        name: 'Work & Office',
        icon: <BriefcaseIcon className="w-5 h-5" />,
        wordCount: 95,
        createdAt: 'Sep 15, 2023',
        words: [],
      },
      {
        id: 'home',
        name: 'At Home',
        icon: <HomeIcon className="w-5 h-5" />,
        wordCount: 64,
        createdAt: 'Sep 1, 2023',
        words: [],
      },
      {
        id: 'shopping',
        name: 'Shopping',
        icon: <ShoppingCartIcon className="w-5 h-5" />,
        wordCount: 48,
        createdAt: 'Aug 28, 2023',
        words: [],
      },
      {
        id: 'social',
        name: 'Socializing & Small Talk',
        icon: <ChatBubbleIcon className="w-5 h-5" />,
        wordCount: 81,
        createdAt: 'Aug 10, 2023',
        words: [],
      },
    ]
  },
  {
    title: 'Grammar',
    topics: [
      {
        id: 'tenses',
        name: 'Verb Tenses',
        icon: <ClockIcon className="w-5 h-5" />
      },
      {
        id: 'conditionals',
        name: 'Conditionals',
        icon: <BookOpenIcon className="w-5 h-5" />
      }
    ]
  }
];
