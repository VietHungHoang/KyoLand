import React from 'react';
import type { SidebarSection } from '../types';
import { LogoIcon, SettingsIcon, Icon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from './icons/Icons';

interface SidebarProps {
  sections: SidebarSection[];
  selectedSection: string;
  onSelectSection: (title: string) => void;
  onOpenSettingsModal: () => void;
  isCollapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sections, selectedSection, onSelectSection, onOpenSettingsModal, isCollapsed, onToggle }) => {
  
  const getSectionIconName = (section: SidebarSection): string => {
    if (section.title === 'Vocabulary') return 'BookOpenIcon';
    if (section.title === 'Vocabulary-API') return 'WifiIcon';
    if (section.topics.length > 0 && section.topics[0].icon) return section.topics[0].icon;
    return 'BookOpenIcon';
  };

  return (
    <aside className={`bg-surface border-r border-stroke flex flex-col flex-shrink-0 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className={`h-16 flex items-center border-b border-stroke shrink-0 ${isCollapsed ? 'justify-center' : 'px-6'}`}>
        <LogoIcon className="h-8 w-auto text-primary" />
        {!isCollapsed && <span className="ml-3 text-2xl font-bold text-onSurface">LingoSphere</span>}
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {sections.map((section) => (
          <div key={section.title}>
             <button
                onClick={() => onSelectSection(section.title)}
                title={isCollapsed ? section.title : undefined}
                className={`w-full flex items-center px-3 py-2.5 text-lg font-medium rounded-md transition-colors duration-150 ${isCollapsed ? 'justify-center' : ''} ${
                  selectedSection === section.title
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-onSurfaceSecondary hover:bg-gray-100 hover:text-onSurface'
                }`}
              >
              <span className={isCollapsed ? '' : 'mr-3'}>
                <Icon name={getSectionIconName(section)} className="w-5 h-5"/>
              </span>
              {!isCollapsed && section.title}
            </button>
          </div>
        ))}
      </nav>
      <div className="shrink-0">
        <div className="p-4 border-t border-stroke">
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
                <img src="https://picsum.photos/seed/user/40/40" alt="User avatar" className="w-10 h-10 rounded-full shrink-0" />
                {!isCollapsed && (
                    <div className="ml-3 flex-grow">
                        <p className="text-base font-semibold text-onSurface">Alex Doe</p>
                        <p className="text-base text-onSurfaceSecondary">Pro Member</p>
                    </div>
                )}
                <button
                  onClick={onOpenSettingsModal}
                  className={`p-2 rounded-full text-onSurfaceSecondary hover:bg-gray-100 hover:text-onSurface transition-colors ${isCollapsed ? 'ml-2' : ''} ${!isCollapsed && 'ml-auto'}`}
                  aria-label="Open settings"
                  title="Settings"
                >
                  <SettingsIcon className="w-6 h-6" />
                </button>
            </div>
        </div>
        <div className="p-2 border-t border-stroke">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-center p-2 rounded-lg text-onSurfaceSecondary hover:bg-gray-100 hover:text-onSurface transition-colors"
                title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
                {isCollapsed ? <ChevronDoubleRightIcon className="w-5 h-5"/> : <ChevronDoubleLeftIcon className="w-5 h-5"/>}
            </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;