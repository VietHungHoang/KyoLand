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
            example: 'Our final destination is the sunny beaches of Hawaii.',
            synonyms: [
              { word: 'goal', comparison: "'Destination' refers specifically to a physical place you travel to, while 'goal' is a broader term for an aim or desired result, which may not be a location." },
              { word: 'target', comparison: "'Target' often implies an objective to be reached or achieved, which can be a location but is more commonly used for abstract goals or in contexts like sales or military operations. 'Destination' is purely for travel." },
              { word: 'end-point', comparison: "'End-point' is a more technical or formal term for the final point in a journey or process. 'Destination' is more common in everyday travel language." }
            ]
          },
          {
            id: 'word-2',
            word: 'Itinerary',
            phonetic: '/aɪˈtɪn.ə.rer.i/',
            partOfSpeech: 'noun',
            vietnameseMeaning: 'Lịch trình',
            definition: 'A planned route or journey.',
            example: 'The travel agent prepared a detailed itinerary for our trip to Italy.',
            notes: "Often confused with 'schedule'. An itinerary is a detailed plan for a journey, including the route and places to be visited."
          },
          {
            id: 'word-3',
            word: 'Explore',
            phonetic: '/ɪkˈsplɔːr/',
            partOfSpeech: 'verb',
            vietnameseMeaning: 'Khám phá',
            definition: 'Travel through (an unfamiliar area) in order to learn about it.',
            example: 'We decided to explore the ancient ruins on our own.',
            synonyms: [
              { word: 'discover', comparison: "'Explore' is the action of traveling and searching an area, while 'discover' is the result of finding something new or unexpected during that exploration." },
              { word: 'investigate', comparison: "'Investigate' implies a more formal and systematic examination to find facts, often related to a problem or crime. 'Explore' is more about general learning and experience." }
            ]
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
