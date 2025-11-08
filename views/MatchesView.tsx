
import React from 'react';
import { User } from '../types';
import ProfileCard from '../components/ProfileCard';

interface MatchesViewProps {
  currentUser: User;
  allUsers: User[];
}

const MatchesView: React.FC<MatchesViewProps> = ({ currentUser, allUsers }) => {
  const matchedUsers = allUsers.filter(user => currentUser.matches.includes(user.id));

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Your Matches</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">These are the people you've connected with. Start a conversation!</p>
      
      {matchedUsers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {matchedUsers.map(user => (
            <ProfileCard 
              key={user.id} 
              user={user} 
              currentUser={currentUser} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">No matches yet!</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Head over to the Explore page to find people to connect with.</p>
        </div>
      )}
    </div>
  );
};

export default MatchesView;
