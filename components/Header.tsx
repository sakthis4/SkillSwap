import React from 'react';
import { User } from '../types';
import { View } from '../App';
import Avatar from './Avatar';

interface HeaderProps {
  currentUser: User;
  currentView: View;
  setCurrentView: (view: View) => void;
  onLogout: () => void;
}

const NavLink: React.FC<{
    isActive: boolean;
    onClick: () => void;
    children: React.ReactNode;
}> = ({ isActive, onClick, children }) => (
    <button
        onClick={onClick}
        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
            isActive
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
    >
        {children}
    </button>
);


const Header: React.FC<HeaderProps> = ({ currentUser, currentView, setCurrentView, onLogout }) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">SkillSwap AI</h1>
            </div>
            <nav className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <NavLink isActive={currentView === 'explore'} onClick={() => setCurrentView('explore')}>Explore</NavLink>
                <NavLink isActive={currentView === 'matches'} onClick={() => setCurrentView('matches')}>Matches</NavLink>
                <NavLink isActive={currentView === 'messages'} onClick={() => setCurrentView('messages')}>Messages</NavLink>
                <NavLink isActive={currentView === 'feed'} onClick={() => setCurrentView('feed')}>Feed</NavLink>
                <NavLink isActive={currentView === 'profile'} onClick={() => setCurrentView('profile')}>Profile</NavLink>
                {currentUser.isAdmin && (
                   <NavLink isActive={currentView === 'admin'} onClick={() => setCurrentView('admin')}>Admin</NavLink>
                )}
              </div>
            </nav>
          </div>
          <div className="flex items-center">
             <span className="text-gray-800 dark:text-gray-200 text-sm font-medium mr-3">{currentUser.name}</span>
             <Avatar user={currentUser} size="sm" showStatus={true} />
             <button onClick={onLogout} className="ml-4 px-3 py-1.5 rounded-md text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition-colors">
                Logout
             </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;