
import React from 'react';
import { User, Skill, Product } from '../types';
import { MOCK_PRODUCTS } from '../constants';
import SkillTag from './SkillTag';
import Avatar from './Avatar';

interface ProfileCardProps {
  user: User;
  currentUser: User;
  onConnect?: (userId: number) => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ user, currentUser, onConnect }) => {
  const isConnected = currentUser.matches.includes(user.id);
  const recommendedProducts = MOCK_PRODUCTS.filter(p => user.skillsToTeach.some(s => s.id === p.skillId));
  
  const isSkillMatch = (skill: Skill, skillsList: Skill[]) => {
      return skillsList.some(s => s.id === skill.id);
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700 transition-transform hover:scale-105 duration-300 flex flex-col`}>
      <div className="p-6 flex-grow">
        <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
                <Avatar user={user} size="lg" showStatus={true} />
                <div className="ml-4">
                    <div className="flex items-center">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{user.name}</h3>
                        {user.linkedinUrl && (
                            <a href={user.linkedinUrl} target="_blank" rel="noopener noreferrer" title="View LinkedIn Profile" className="ml-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.925.017-2.112-1.286-2.112-1.286 0-1.485 1.002-1.485 2.046v4.91h-2.4V6.169h2.306v1.001h.033c.306-.578 1.06-1.183 2.268-1.183 2.432 0 2.878 1.597 2.878 3.676v4.243h-2.4z"/>
                                </svg>
                            </a>
                        )}
                    </div>
                    <p className="text-sm font-semibold text-blue-500">Level {user.level}</p>
                </div>
            </div>
        </div>
        
        <div className="mb-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${user.xp}%` }}></div>
            </div>
            <p className="text-xs text-right text-gray-500 dark:text-gray-400 mt-1">{user.xp}/100 XP to next level</p>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">{user.bio}</p>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">Wants to Learn:</h4>
            <div className="flex flex-wrap gap-2">
              {user.skillsToLearn.map(skill => (
                <SkillTag key={skill.id} skill={skill} type="learn" isHighlighted={isSkillMatch(skill, currentUser.skillsToTeach)} />
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">Can Teach:</h4>
            <div className="flex flex-wrap gap-2">
              {user.skillsToTeach.map(skill => (
                <SkillTag key={skill.id} skill={skill} type="teach" isHighlighted={isSkillMatch(skill, currentUser.skillsToLearn)} />
              ))}
            </div>
          </div>
           <div>
            <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">Badges:</h4>
            <div className="flex flex-wrap gap-2">
              {user.badges.map((badge, index) => (
                <span key={index} className="text-xs font-semibold px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-full">
                  🏅 {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        {onConnect && (
            <div className="mt-6">
                <button 
                    onClick={() => onConnect(user.id)}
                    disabled={isConnected}
                    className="w-full font-bold py-2 px-4 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-blue-500 disabled:cursor-not-allowed"
                    style={{
                        backgroundColor: isConnected ? '#4B5563' : '#2563EB',
                        color: 'white',
                        opacity: isConnected ? 0.7 : 1,
                    }}
                >
                    {isConnected ? 'Connected' : 'Connect'}
                </button>
            </div>
        )}
      </div>

      {recommendedProducts.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-900/50 p-4 border-t border-gray-200 dark:border-gray-700">
              <h5 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-3">Shop Related Products</h5>
              {recommendedProducts.map(product => (
                  <div key={product.id} className="flex items-center justify-between mb-2 last:mb-0">
                      <div className="flex items-center">
                          <img src={product.imageUrl} alt={product.name} className="w-10 h-10 rounded-md object-cover mr-3" />
                          <div>
                              <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{product.name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{product.price}</p>
                          </div>
                      </div>
                       <a href={product.amazonUrl} target="_blank" rel="noopener noreferrer" className="text-xs bg-yellow-500 text-black font-semibold px-2 py-1 rounded-md hover:bg-yellow-600 transition-colors">
                            View on Amazon
                       </a>
                  </div>
              ))}
          </div>
      )}
    </div>
  );
};

export default ProfileCard;
