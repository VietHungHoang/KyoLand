import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import VocabularyView from './components/VocabularyView';
import CreateTopicModal from './components/CreateTopicModal';
import TopicDetailView from './components/TopicDetailView';
import { SIDEBAR_SECTIONS } from './constants';
import type { Topic } from './types';
import { BookOpenIcon, ChatBubbleIcon } from './components/icons/Icons';

const App: React.FC = () => {
  const [sidebarSections, setSidebarSections] = useState(SIDEBAR_SECTIONS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState('Vocabulary');
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);

  const allTopics = sidebarSections.flatMap(section => section.topics);

  const vocabularyTopics = sidebarSections.find(section => section.title === 'Vocabulary')?.topics || [];

  const handleCreateTopic = (topicName: string) => {
    const newTopic: Topic = {
      id: topicName.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
      name: topicName,
      icon: <ChatBubbleIcon className="w-5 h-5" />,
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
    setIsModalOpen(false);
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

  const renderContent = () => {
    if (selectedSection === 'Vocabulary') {
      const activeTopic = vocabularyTopics.find(t => t.id === activeTopicId);
      if (activeTopic) {
        return <TopicDetailView topic={activeTopic} />;
      }
      return <VocabularyView topics={vocabularyTopics} onOpenCreateTopicModal={() => setIsModalOpen(true)} onDeleteTopic={handleDeleteTopic} onSelectTopic={setActiveTopicId} />;
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
        icon: activeTopic?.icon || <BookOpenIcon className="w-5 h-5"/>,
        showBackButton: true,
        onBack: () => setActiveTopicId(null)
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
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header {...getHeaderProps()} />
        <main className="flex-1 overflow-y-auto p-8">
          {renderContent()}
        </main>
      </div>
      <CreateTopicModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateTopic}
      />
    </div>
  );
};

export default App;
