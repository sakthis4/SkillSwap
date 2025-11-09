

import React, { useEffect } from 'react';
import { User, Skill, TFunction } from '../types';
import SwipeCard from '../components/SwipeCard';

interface ExploreViewProps {
  currentUser: User;
  usersToExplore: User[];
  currentIndex: number;
  onSwipe: (direction: 'left' | 'right', swipedUserId: number) => void;
  onGoBack: () => void;
  allSkills: Skill[];
  t: TFunction;
}

const ExploreView: React.FC<ExploreViewProps> = ({ currentUser, usersToExplore, currentIndex, onSwipe, onGoBack, allSkills, t }) => {
  const cardsToDisplay = usersToExplore.slice(currentIndex, currentIndex + 3);
  const currentUserCard = usersToExplore[currentIndex];

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!currentUserCard) return;

      if (event.key === 'ArrowLeft') {
        onSwipe('left', currentUserCard.id);
      } else if (event.key === 'ArrowRight') {
        onSwipe('right', currentUserCard.id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentUserCard, onSwipe]);


  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('exploreTitle')}</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">{t('exploreSubtitle')}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">{t('exploreTip')}</p>

      <div className="relative w-full max-w-sm h-[600px] flex items-center justify-center">
        {cardsToDisplay.length > 0 ? (
          cardsToDisplay.map((user, index) => (
            <div
              key={user.id}
              className="absolute w-full h-full transition-all duration-300 ease-in-out"
              style={{
                transform: index === 0 ? 'none' : `scale(${1 - index * 0.05}) translateY(${index * 20}px)`,
                zIndex: 10 - index,
              }}
            >
              <SwipeCard
                user={user}
                currentUser={currentUser}
                onSwipe={(dir) => onSwipe(dir, user.id)}
                isInteractive={index === 0}
                allSkills={allSkills}
                t={t}
              />
            </div>
          ))
        ) : (
          <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">{t('thatsEveryone')}</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">{t('checkBackLater')}</p>
          </div>
        )}
      </div>

      {currentUserCard && (
        <div className="flex items-center space-x-8 mt-8">
            <button 
                onClick={onGoBack}
                className="flex items-center justify-center w-20 h-20 bg-white dark:bg-gray-700 rounded-full shadow-lg transform transition-transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-yellow-500/50"
                aria-label={t('goBack')}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l5-5m-5 5l5 5" />
                </svg>
            </button>
            <button 
                onClick={() => onSwipe('right', currentUserCard.id)}
                className="flex items-center justify-center w-24 h-24 bg-white dark:bg-gray-700 rounded-full shadow-lg transform transition-transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-green-500/50"
                aria-label={t('connect')}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
            </button>
        </div>
      )}
    </div>
  );
};

export default ExploreView;