

import React from 'react';
import { User, Match, Skill, TFunction } from '../types';
import ProfileCard from '../components/ProfileCard';

interface MatchesViewProps {
  currentUser: User;
  allUsers: User[];
  onUpdateStatus: (partnerId: number, status: Match['status']) => void;
  onSessionProposalResponse: (partnerId: number, response: 'accepted' | 'declined') => void;
  onRateSession: (partnerId: number, rating: number) => void;
  allSkills: Skill[];
  t: TFunction;
}

const MatchesView: React.FC<MatchesViewProps> = ({ currentUser, allUsers, onUpdateStatus, onSessionProposalResponse, onRateSession, allSkills, t }) => {
  const matchedUsers = currentUser.matches.map(match => {
    const user = allUsers.find(u => u.id === match.userId);
    return { user, matchDetails: match };
  }).filter(item => item.user);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('matchesTitle')}</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">{t('matchesSubtitle')}</p>
      
      {matchedUsers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {matchedUsers.map(({ user, matchDetails }) => user && (
            <ProfileCard 
              key={user.id} 
              user={user} 
              currentUser={currentUser}
              matchDetails={matchDetails}
              onUpdateStatus={onUpdateStatus}
              onSessionProposalResponse={onSessionProposalResponse}
              onRateSession={onRateSession}
              allSkills={allSkills}
              t={t}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">{t('noMatches')}</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">{t('noMatchesCTA')}</p>
        </div>
      )}
    </div>
  );
};

export default MatchesView;