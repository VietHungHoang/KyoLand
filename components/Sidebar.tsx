import React from 'react';
import type { SidebarSection } from '../types';
import { LogoIcon } from './icons/Icons';

interface SidebarProps {
  sections: SidebarSection[];
  selectedSection: string;
  onSelectSection: (title: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sections, selectedSection, onSelectSection }) => {
  return (
    <aside className="w-64 bg-surface border-r border-stroke flex flex-col flex-shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-stroke">
        <LogoIcon className="h-8 w-auto text-primary" />
        <span className="ml-3 text-2xl font-bold text-onSurface">LingoSphere</span>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-6">
        {sections.map((section) => (
          <div key={section.title}>
             <button
                onClick={() => onSelectSection(section.title)}
                className={`w-full flex items-center px-3 py-2.5 text-lg font-medium rounded-md transition-colors duration-150 ${
                  selectedSection === section.title
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-onSurfaceSecondary hover:bg-gray-100 hover:text-onSurface'
                }`}
              >
              <span className="mr-3">{section.topics[0].icon}</span>
              {section.title}
            </button>
          </div>
        ))}
      </nav>
      <div className="p-4 border-t border-stroke">
        <div className="flex items-center">
            <img src="https://picsum.photos/seed/user/40/40" alt="User avatar" className="w-10 h-10 rounded-full" />
            <div className="ml-3">
                <p className="text-base font-semibold text-onSurface">Alex Doe</p>
                <p className="text-base text-onSurfaceSecondary">Pro Member</p>
            </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;