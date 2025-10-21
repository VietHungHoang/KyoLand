import React from 'react';
import { BellIcon, SearchIcon, ChevronLeftIcon } from './icons/Icons';

interface HeaderProps {
  title: string;
  icon: React.ReactNode;
  showBackButton?: boolean;
  onBack?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, icon, showBackButton, onBack }) => {
  return (
    <header className="h-16 bg-surface border-b border-stroke flex-shrink-0 flex items-center justify-between px-8">
      <div className="flex items-center">
        {showBackButton && (
          <button onClick={onBack} className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors">
            <ChevronLeftIcon className="w-6 h-6 text-onSurfaceSecondary" />
          </button>
        )}
        <div className="p-2 bg-primary/10 text-primary rounded-md">
          {icon}
        </div>
        <h2 className="ml-4 text-2xl font-semibold text-onSurface">{title}</h2>
      </div>
      <div className="flex items-center space-x-2">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-onSurfaceSecondary" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 w-64 bg-background border border-stroke rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition text-base"
          />
        </div>
        <button className="p-2 rounded-full hover:bg-gray-100 transition">
          <BellIcon className="w-6 h-6 text-onSurfaceSecondary" />
        </button>
      </div>
    </header>
  );
};

export default Header;
