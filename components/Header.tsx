
import React, { useState } from 'react';
import { User } from '../types';
import { View } from '../App';
import Avatar from './Avatar';
import { Language } from '../utils/translations';

interface HeaderProps {
  currentUser: User;
  currentView: View;
  setCurrentView: (view: View) => void;
  onLogout: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: any) => string;
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

const MobileNavLink: React.FC<{
    isActive: boolean;
    onClick: () => void;
    children: React.ReactNode;
}> = ({ isActive, onClick, children }) => (
    <button
        onClick={onClick}
        className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
            isActive
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
    >
        {children}
    </button>
);


const Header: React.FC<HeaderProps> = ({ currentUser, currentView, setCurrentView, onLogout, language, setLanguage, t }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangMenuOpen, setisLangMenuOpen] = useState(false);

  const handleMobileLinkClick = (view: View) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
  };
  
  const handleLogoutClick = () => {
    setIsMobileMenuOpen(false);
    onLogout();
  }
  
  const languages: { code: Language, name: string }[] = [
      { code: 'en', name: 'English' },
      { code: 'hi', name: 'हिन्दी' },
      { code: 'ta', name: 'தமிழ்' }
  ];

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">SkillSwap AI</h1>
            </div>
            <nav className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <NavLink isActive={currentView === 'matches'} onClick={() => setCurrentView('matches')}>{t('matches')}</NavLink>
                <NavLink isActive={currentView === 'messages'} onClick={() => setCurrentView('messages')}>{t('messages')}</NavLink>
                <NavLink isActive={currentView === 'calendar'} onClick={() => setCurrentView('calendar')}>{t('calendar')}</NavLink>
                <NavLink isActive={currentView === 'feed'} onClick={() => setCurrentView('feed')}>{t('feed')}</NavLink>
                <NavLink isActive={currentView === 'library'} onClick={() => setCurrentView('library')}>{t('library')}</NavLink>
                <NavLink isActive={currentView === 'marketplace'} onClick={() => setCurrentView('marketplace')}>{t('marketplace')}</NavLink>
                <NavLink isActive={currentView === 'explore'} onClick={() => setCurrentView('explore')}>{t('explore')}</NavLink>
                <NavLink isActive={currentView === 'profile'} onClick={() => setCurrentView('profile')}>{t('profile')}</NavLink>
                {currentUser.isAdmin && (
                   <NavLink isActive={currentView === 'admin'} onClick={() => setCurrentView('admin')}>Admin</NavLink>
                )}
              </div>
            </nav>
          </div>
          <div className="hidden md:flex items-center">
            <div className="relative">
                <button onClick={() => setisLangMenuOpen(!isLangMenuOpen)} className="mr-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 12a1 1 0 112 0 1 1 0 01-2 0zm1 4a5.942 5.942 0 005.657-4H4.343A5.942 5.942 0 0010 16z" />
                        <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM5.464 8a.5.5 0 01.707 0L10 11.586l3.828-3.828a.5.5 0 11.707.707L10.707 12.293a1 1 0 01-1.414 0L5.464 8.707a.5.5 0 010-.707z" clipRule="evenodd" />
                    </svg>
                </button>
                {isLangMenuOpen && (
                    <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1">
                        {languages.map(lang => (
                             <button
                                key={lang.code}
                                onClick={() => { setLanguage(lang.code); setisLangMenuOpen(false); }}
                                className={`block w-full text-left px-4 py-2 text-sm ${language === lang.code ? 'bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-100' : 'text-gray-700 dark:text-gray-200'} hover:bg-gray-100 dark:hover:bg-gray-600`}
                            >
                                {lang.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>
             <span className="text-gray-800 dark:text-gray-200 text-sm font-medium mr-3">{currentUser.name}</span>
             <Avatar user={currentUser} size="sm" showStatus={true} />
             <button onClick={onLogout} className="ml-4 px-3 py-1.5 rounded-md text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition-colors">
                {t('logout')}
             </button>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="bg-gray-100 dark:bg-gray-700 inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m4 6H4" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {isMobileMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <MobileNavLink isActive={currentView === 'matches'} onClick={() => handleMobileLinkClick('matches')}>{t('matches')}</MobileNavLink>
            <MobileNavLink isActive={currentView === 'messages'} onClick={() => handleMobileLinkClick('messages')}>{t('messages')}</MobileNavLink>
            <MobileNavLink isActive={currentView === 'calendar'} onClick={() => handleMobileLinkClick('calendar')}>{t('calendar')}</MobileNavLink>
            <MobileNavLink isActive={currentView === 'feed'} onClick={() => handleMobileLinkClick('feed')}>{t('feed')}</MobileNavLink>
            <MobileNavLink isActive={currentView === 'library'} onClick={() => handleMobileLinkClick('library')}>{t('library')}</MobileNavLink>
            <MobileNavLink isActive={currentView === 'marketplace'} onClick={() => handleMobileLinkClick('marketplace')}>{t('marketplace')}</MobileNavLink>
            <MobileNavLink isActive={currentView === 'explore'} onClick={() => handleMobileLinkClick('explore')}>{t('explore')}</MobileNavLink>
            <MobileNavLink isActive={currentView === 'profile'} onClick={() => handleMobileLinkClick('profile')}>{t('profile')}</MobileNavLink>
            {currentUser.isAdmin && (
                <MobileNavLink isActive={currentView === 'admin'} onClick={() => handleMobileLinkClick('admin')}>Admin</MobileNavLink>
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center px-5">
              <Avatar user={currentUser} size="md" showStatus={true} />
              <div className="ml-3">
                <div className="text-base font-medium leading-none text-gray-800 dark:text-white">{currentUser.name}</div>
                <div className="text-sm font-medium leading-none text-gray-500 dark:text-gray-400">Level {currentUser.level}</div>
              </div>
            </div>
            <div className="mt-3 px-2 space-y-1">
              <button onClick={handleLogoutClick} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
                {t('logout')}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
