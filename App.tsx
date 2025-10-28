import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import VocabularyView from './components/VocabularyView';
import VocabularyApiView from './components/VocabularyApiView';
import CreateTopicModal from './components/CreateTopicModal';
import AddWordManuallyModal from './components/AddWordManuallyModal';
import SettingsModal from './components/SettingsModal';
import TopicDetailView from './components/TopicDetailView';
import DictationView from './components/DictationView';
import CreateDictationTopicModal from './components/CreateDictationTopicModal';
import DictationTopicDetailView from './components/DictationTopicDetailView';
import PracticeSetupView from './components/PracticeSetupView';
import QuizView from './components/QuizView';
import ToeicLandingView from './components/ToeicLandingView';
import ToeicPartSelectionView from './components/ToeicPartSelectionView';
import ToeicTestSelectionView from './components/ToeicTestSelectionView';
import ToeicQuizView from './components/ToeicQuizView';

import { SIDEBAR_SECTIONS_INITIAL } from './constants';
import type { Topic, VocabularyWord, SidebarSection, DictationTopic, QuizQuestion } from './types';
import { BookOpenIcon, Icon, MicrophoneIcon, WifiIcon, AcademicCapIcon, QueueListIcon } from './components/icons/Icons';

const App: React.FC = () => {
  // Vocabulary State
  const [sidebarSections, setSidebarSections] = useState<SidebarSection[]>(() => {
    try {
      const storedData = localStorage.getItem('lingosphere-data');
      if (storedData) {
        const parsed = JSON.parse(storedData);
        // Migration logic to ensure practiceCount exists
        return parsed.map((section: SidebarSection) => ({
          ...section,
          topics: section.topics.map(topic => {
            if (section.title === 'Vocabulary' && topic.words) {
              return {
                ...topic,
                words: (topic.words || []).map((word: any) => ({
                  ...word,
                  practiceCount: word.practiceCount || 0,
                })),
              };
            }
            return topic;
          }),
        }));
      }
    } catch (error) {
      console.error("Could not parse sidebar sections from localStorage", error);
    }
    
    // Return the default empty structure if no data is found in localStorage
    return SIDEBAR_SECTIONS_INITIAL;
  });
  
  // Dictation State
  const [dictationTopics, setDictationTopics] = useState<DictationTopic[]>(() => {
    try {
      const storedData = localStorage.getItem('lingosphere-dictation-topics');
      if (storedData) {
        return JSON.parse(storedData);
      }
    } catch (error) {
      console.error("Could not parse dictation topics from localStorage", error);
    }
    return [];
  });

  const [isCreateTopicModalOpen, setIsCreateTopicModalOpen] = useState(false);
  const [isCreateDictationModalOpen, setIsCreateDictationModalOpen] = useState(false);
  const [isAddWordManuallyModalOpen, setIsAddWordManuallyModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState('Vocabulary');
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // Practice State
  const [practiceTopicId, setPracticeTopicId] = useState<string | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<{ questions: QuizQuestion[]; words: VocabularyWord[] } | null>(null);

  // TOEIC State
  const [toeicView, setToeicView] = useState<'main' | 'parts' | 'tests' | 'quiz'>('main');
  const [selectedToeicSet, setSelectedToeicSet] = useState<string | null>(null);
  const [selectedToeicPart, setSelectedToeicPart] = useState<number | null>(null);
  const [selectedToeicTest, setSelectedToeicTest] = useState<number | null>(null);

  useEffect(() => {
    const storedApiKey = localStorage.getItem('gemini-api-key');
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, []);

  // Persist Vocabulary Data
  useEffect(() => {
    try {
      localStorage.setItem('lingosphere-data', JSON.stringify(sidebarSections));
    } catch (error) {
      console.error("Could not save sidebar sections to localStorage", error);
    }
  }, [sidebarSections]);
  
  // Persist Dictation Data
  useEffect(() => {
    try {
      localStorage.setItem('lingosphere-dictation-topics', JSON.stringify(dictationTopics));
    } catch (error) {
      console.error("Could not save dictation topics to localStorage", error);
    }
  }, [dictationTopics]);


  const allVocabTopics = sidebarSections.flatMap(section => section.topics);
  const vocabularyTopics = sidebarSections.find(section => section.title === 'Vocabulary')?.topics || [];
  
  const activeVocabTopic = allVocabTopics.find(t => t.id === activeTopicId);
  const practiceVocabTopic = allVocabTopics.find(t => t.id === practiceTopicId);
  const activeDictationTopic = dictationTopics.find(t => t.id === activeTopicId);

  const handleCreateTopic = (topicName: string) => {
    const newTopic: Topic = {
      id: topicName.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
      name: topicName,
      icon: 'ChatBubbleIcon',
      wordCount: 0,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      words: [],
    };

    setSidebarSections(currentSections =>
      currentSections.map(section => {
        if (section.title === 'Vocabulary') {
          return {
            ...section,
            topics: [...section.topics, newTopic],
          };
        }
        return section;
      })
    );
    setIsCreateTopicModalOpen(false);
  };
  
  const handleCreateDictationTopic = (topicData: Omit<DictationTopic, 'id' | 'createdAt' | 'icon'>) => {
    const newTopic: DictationTopic = {
      ...topicData,
      id: topicData.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
      icon: 'MicrophoneIcon',
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };
    setDictationTopics(current => [...current, newTopic]);
    setIsCreateDictationModalOpen(false);
  };

  const handleDeleteTopic = (topicIdToDelete: string) => {
    if (!window.confirm("Are you sure you want to delete this topic? This action cannot be undone.")) {
      return;
    }
    
    if (activeTopicId === topicIdToDelete) setActiveTopicId(null);
    if (practiceTopicId === topicIdToDelete) setPracticeTopicId(null);

    setSidebarSections(currentSections =>
      currentSections.map(section => ({
        ...section,
        topics: section.topics.filter(topic => topic.id !== topicIdToDelete),
      }))
    );
    setDictationTopics(current => current.filter(topic => topic.id !== topicIdToDelete));
  };
  
  const handleUpdateDictationTopic = (updatedTopic: DictationTopic) => {
    setDictationTopics(currentTopics => 
        currentTopics.map(topic => 
            topic.id === updatedTopic.id ? updatedTopic : topic
        )
    );
  };
  
  const handleSaveApiKey = (newApiKey: string) => {
    setApiKey(newApiKey);
    localStorage.setItem('gemini-api-key', newApiKey);
    setIsSettingsModalOpen(false);
  };

  const handleAddWord = (topicId: string, newWord: VocabularyWord) => {
    setSidebarSections(currentSections =>
      currentSections.map(section => {
        if (section.title === 'Vocabulary') {
          return {
            ...section,
            topics: section.topics.map(topic => {
              if (topic.id === topicId) {
                const updatedWords = [newWord, ...(topic.words || [])];
                return {
                  ...topic,
                  words: updatedWords,
                  wordCount: updatedWords.length,
                };
              }
              return topic;
            }),
          };
        }
        return section;
      })
    );
    setIsAddWordManuallyModalOpen(false);
  };

  const handleStartPractice = (topicId: string) => {
    setActiveTopicId(null);
    setPracticeTopicId(topicId);
  };

  const handleStartQuiz = (quizData: { questions: QuizQuestion[], words: VocabularyWord[] }) => {
    setPracticeTopicId(null);
    setActiveQuiz(quizData);
  };
  
  const handleFinishQuiz = (practicedWords: VocabularyWord[]) => {
    const practicedWordIds = new Set(practicedWords.map(w => w.id));
    setSidebarSections(currentSections =>
      currentSections.map(section => ({
        ...section,
        topics: section.topics.map(topic => {
          if (topic.words) {
            return {
              ...topic,
              words: topic.words.map((word: VocabularyWord) => {
                if (practicedWordIds.has(word.id)) {
                  return {
                    ...word,
                    practiceCount: (word.practiceCount || 0) + 1,
                  };
                }
                return word;
              }),
            };
          }
          return topic;
        }),
      }))
    );
    setActiveQuiz(null);
  };
  
  const resetToeicState = () => {
    setToeicView('main');
    setSelectedToeicSet(null);
    setSelectedToeicPart(null);
    setSelectedToeicTest(null);
  };
  
  const renderContent = () => {
    if (activeQuiz) {
        return <QuizView quizData={activeQuiz} onFinishQuiz={handleFinishQuiz} onBack={() => setActiveQuiz(null)} apiKey={apiKey}/>
    }
    
    if (practiceVocabTopic) {
        return <PracticeSetupView topic={practiceVocabTopic} onStartQuiz={handleStartQuiz} onBack={() => setPracticeTopicId(null)} apiKey={apiKey}/>
    }

    if (selectedSection === 'Vocabulary') {
      if (activeVocabTopic) {
        return <TopicDetailView topic={activeVocabTopic} onOpenAddWordManuallyModal={() => setIsAddWordManuallyModalOpen(true)} onStartPractice={handleStartPractice} />;
      }
      return <VocabularyView topics={vocabularyTopics} onOpenCreateTopicModal={() => setIsCreateTopicModalOpen(true)} onDeleteTopic={handleDeleteTopic} onSelectTopic={setActiveTopicId} onStartPractice={handleStartPractice} />;
    }
    
    if (selectedSection === 'Vocabulary-API') {
      return <VocabularyApiView />;
    }

    if (selectedSection === 'Dictation') {
      if (activeDictationTopic) {
        return <DictationTopicDetailView topic={activeDictationTopic} onUpdateTopic={handleUpdateDictationTopic} apiKey={apiKey} />;
      }
      return <DictationView topics={dictationTopics} onOpenCreateTopicModal={() => setIsCreateDictationModalOpen(true)} onDeleteTopic={handleDeleteTopic} onSelectTopic={setActiveTopicId} />;
    }

    if (selectedSection === 'Toeic') {
        switch (toeicView) {
            case 'main':
                return <ToeicLandingView onSelectSet={(set) => { setSelectedToeicSet(set); setToeicView('parts'); }} />;
            case 'parts':
                return <ToeicPartSelectionView onSelectPart={(part) => { setSelectedToeicPart(part); setToeicView('tests'); }} />;
            case 'tests':
                return <ToeicTestSelectionView partNumber={selectedToeicPart!} onSelectTest={(test) => { setSelectedToeicTest(test); setToeicView('quiz'); }} />;
            case 'quiz':
                return <ToeicQuizView partNumber={selectedToeicPart!} testNumber={selectedToeicTest!} apiKey={apiKey} onFinish={resetToeicState} />;
            default:
                return null;
        }
    }
    
    if (selectedSection === 'Grammar') {
       const grammarTopic = sidebarSections.find(s => s.title === 'Grammar')?.topics[0];
       return (
        <div className="bg-surface rounded-xl shadow-sm border border-stroke p-8">
          <h1 className="text-4xl font-bold text-onSurface mb-2">
            Welcome to the '{grammarTopic?.name}' topic!
          </h1>
          <p className="text-onSurfaceSecondary text-xl">
            This is where the learning content for the selected grammar topic will be displayed.
            Explore the sidebar to switch between different subjects.
          </p>
        </div>
      );
    }
    
    return null;
  };
  
  const getHeaderProps = () => {
    if (activeQuiz) {
        return {
            title: 'Practice Quiz',
            icon: <AcademicCapIcon className="w-5 h-5"/>,
            showBackButton: true,
            onBack: () => setActiveQuiz(null),
        }
    }
    if (practiceVocabTopic) {
        return {
            title: `Practice: ${practiceVocabTopic.name}`,
            icon: <AcademicCapIcon className="w-5 h-5"/>,
            showBackButton: true,
            onBack: () => setPracticeTopicId(null),
        }
    }
    if (activeTopicId && (selectedSection === 'Vocabulary' || selectedSection === 'Dictation')) {
      const activeTopic = activeVocabTopic || activeDictationTopic;
      return {
        title: activeTopic?.name || 'Topic',
        icon: <Icon name={activeTopic?.icon || 'BookOpenIcon'} className="w-5 h-5"/>,
        showBackButton: true,
        onBack: () => setActiveTopicId(null),
      }
    }
    
    if (selectedSection === 'Vocabulary-API') {
      return {
        title: 'Vocabulary API',
        icon: <WifiIcon className="w-5 h-5" />,
        showBackButton: false,
      }
    }
     if (selectedSection === 'Dictation') {
      return {
        title: 'Dictation',
        icon: <MicrophoneIcon className="w-5 h-5" />,
        showBackButton: false,
      }
    }
    if (selectedSection === 'Toeic') {
        switch (toeicView) {
            case 'main':
                return { title: 'TOEIC Practice', icon: <QueueListIcon className="w-5 h-5"/>, showBackButton: false };
            case 'parts':
                return { title: `${selectedToeicSet} Test`, icon: <QueueListIcon className="w-5 h-5"/>, showBackButton: true, onBack: () => { setToeicView('main'); setSelectedToeicSet(null); }};
            case 'tests':
                return { title: `Part ${selectedToeicPart} Practice`, icon: <QueueListIcon className="w-5 h-5"/>, showBackButton: true, onBack: () => { setToeicView('parts'); setSelectedToeicPart(null); }};
            case 'quiz':
                return { title: `Part ${selectedToeicPart} - Test ${selectedToeicTest}`, icon: <QueueListIcon className="w-5 h-5"/>, showBackButton: true, onBack: () => { setToeicView('tests'); setSelectedToeicTest(null); }};
        }
    }
    return {
      title: 'Vocabulary',
      icon: <BookOpenIcon className="w-5 h-5" />,
      showBackButton: false,
    }
  }

  return (
    <div className="flex h-screen bg-background text-onSurface font-sans">
      <Sidebar
        sections={SIDEBAR_SECTIONS_INITIAL}
        selectedSection={selectedSection}
        onSelectSection={(section) => {
          setActiveTopicId(null);
          setPracticeTopicId(null);
          setActiveQuiz(null);
          resetToeicState();
          setSelectedSection(section);
        }}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(prev => !prev)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header {...getHeaderProps()} />
        <main className="flex-1 overflow-y-auto p-8">
          {renderContent()}
        </main>
      </div>
      <CreateTopicModal
        isOpen={isCreateTopicModalOpen}
        onClose={() => setIsCreateTopicModalOpen(false)}
        onCreate={handleCreateTopic}
      />
       <CreateDictationTopicModal
        isOpen={isCreateDictationModalOpen}
        onClose={() => setIsCreateDictationModalOpen(false)}
        onCreate={handleCreateDictationTopic}
      />
      {activeVocabTopic && (
        <AddWordManuallyModal
          isOpen={isAddWordManuallyModalOpen}
          onClose={() => setIsAddWordManuallyModalOpen(false)}
          onAddWord={(newWord) => handleAddWord(activeVocabTopic.id, { ...newWord, practiceCount: 0 })}
          topicName={activeVocabTopic.name}
          apiKey={apiKey}
        />
      )}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onSave={handleSaveApiKey}
        currentApiKey={apiKey}
      />
    </div>
  );
};

export default App;
