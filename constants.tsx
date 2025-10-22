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
            definition: 'Nơi mà một người hoặc một vật gì đó đang đi hoặc được gửi đến.',
            example: 'Our final destination is the sunny beaches of Hawaii.',
            synonyms: [
              { word: 'goal', comparison: "'Destination' chỉ một địa điểm vật lý cụ thể bạn đi tới, trong khi 'goal' là một thuật ngữ rộng hơn cho một mục đích hoặc kết quả mong muốn, không nhất thiết phải là một địa điểm." },
              { word: 'target', comparison: "'Target' thường ngụ ý một mục tiêu cần đạt được, có thể là một địa điểm nhưng thường được sử dụng cho các mục tiêu trừu tượng hoặc trong các bối cảnh như bán hàng hoặc quân sự. 'Destination' chỉ dùng cho du lịch." },
              { word: 'end-point', comparison: "'End-point' là một thuật ngữ kỹ thuật hoặc trang trọng hơn cho điểm cuối cùng của một cuộc hành trình hoặc một quá trình. 'Destination' phổ biến hơn trong ngôn ngữ du lịch hàng ngày." }
            ]
          },
          {
            id: 'word-2',
            word: 'Itinerary',
            phonetic: '/aɪˈtɪn.ə.rer.i/',
            partOfSpeech: 'noun',
            vietnameseMeaning: 'Lịch trình',
            definition: 'Một tuyến đường hoặc hành trình đã được lên kế hoạch.',
            example: 'The travel agent prepared a detailed itinerary for our trip to Italy.',
            notes: "Thường bị nhầm lẫn với 'schedule' (lịch trình, thời gian biểu). 'Itinerary' là một kế hoạch chi tiết cho một chuyến đi, bao gồm cả tuyến đường và những nơi sẽ đến thăm."
          },
          {
            id: 'word-3',
            word: 'Explore',
            phonetic: '/ɪkˈsplɔːr/',
            partOfSpeech: 'verb',
            vietnameseMeaning: 'Khám phá',
            definition: 'Đi qua (một khu vực xa lạ) để tìm hiểu về nó.',
            example: 'We decided to explore the ancient ruins on our own.',
            synonyms: [
              { word: 'discover', comparison: "'Explore' là hành động đi lại và tìm kiếm trong một khu vực, trong khi 'discover' là kết quả của việc tìm thấy một điều gì đó mới hoặc bất ngờ trong quá trình khám phá đó." },
              { word: 'investigate', comparison: "'Investigate' ngụ ý một cuộc kiểm tra chính thức và có hệ thống hơn để tìm ra sự thật, thường liên quan đến một vấn đề hoặc tội phạm. 'Explore' mang tính chất học hỏi và trải nghiệm chung chung hơn." }
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