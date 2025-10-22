import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import VocabularyView from './components/VocabularyView';
import CreateTopicModal from './components/CreateTopicModal';
import AddWordManuallyModal from './components/AddWordManuallyModal';
import SettingsModal from './components/SettingsModal';
import TopicDetailView from './components/TopicDetailView';
import { SIDEBAR_SECTIONS_INITIAL } from './constants';
import type { Topic, VocabularyWord, SidebarSection } from './types';
import { BookOpenIcon, Icon } from './components/icons/Icons';

const App: React.FC = () => {
  const [sidebarSections, setSidebarSections] = useState<SidebarSection[]>(() => {
    try {
      const storedData = localStorage.getItem('lingosphere-data');
      if (storedData) {
        return JSON.parse(storedData);
      }
    } catch (error) {
      console.error("Could not parse sidebar sections from localStorage", error);
    }
    return SIDEBAR_SECTIONS_INITIAL;
  });
  
  const [isCreateTopicModalOpen, setIsCreateTopicModalOpen] = useState(false);
  const [isAddWordManuallyModalOpen, setIsAddWordManuallyModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState('Vocabulary');
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    const storedApiKey = localStorage.getItem('gemini-api-key');
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('lingosphere-data', JSON.stringify(sidebarSections));
    } catch (error) {
      console.error("Could not save sidebar sections to localStorage", error);
    }
  }, [sidebarSections]);

  const allTopics = sidebarSections.flatMap(section => section.topics);
  const vocabularyTopics = sidebarSections.find(section => section.title === 'Vocabulary')?.topics || [];
  const activeTopic = allTopics.find(t => t.id === activeTopicId);

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

  const handleDeleteTopic = (topicIdToDelete: string) => {
    if (!window.confirm("Are you sure you want to delete this topic? This action cannot be undone.")) {
      return;
    }
    
    if (activeTopicId === topicIdToDelete) {
      setActiveTopicId(null);
    }

    setSidebarSections(currentSections =>
      currentSections.map(section => ({
        ...section,
        topics: section.topics.filter(topic => topic.id !== topicIdToDelete),
      }))
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
                const updatedWords = [...(topic.words || []), newWord];
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

  const renderContent = () => {
    if (selectedSection === 'Vocabulary') {
      const activeTopic = vocabularyTopics.find(t => t.id === activeTopicId);
      if (activeTopic) {
        return <TopicDetailView topic={activeTopic} onOpenAddWordManuallyModal={() => setIsAddWordManuallyModalOpen(true)} />;
      }
      return <VocabularyView topics={vocabularyTopics} onOpenCreateTopicModal={() => setIsCreateTopicModalOpen(true)} onDeleteTopic={handleDeleteTopic} onSelectTopic={setActiveTopicId} />;
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
    if (activeTopicId) {
      const activeTopic = allTopics.find(t => t.id === activeTopicId);
      return {
        title: activeTopic?.name || 'Topic',
        icon: <Icon name={activeTopic?.icon || 'BookOpenIcon'} className="w-5 h-5"/>,
        showBackButton: true,
        onBack: () => setActiveTopicId(null),
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
        sections={sidebarSections}
        selectedSection={selectedSection}
        onSelectSection={setSelectedSection}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
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
      {activeTopic && (
        <AddWordManuallyModal
          isOpen={isAddWordManuallyModalOpen}
          onClose={() => setIsAddWordManuallyModalOpen(false)}
          onAddWord={(newWord) => handleAddWord(activeTopic.id, newWord)}
          topicName={activeTopic.name}
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