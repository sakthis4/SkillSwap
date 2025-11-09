

import React, { useState } from 'react';
import { User, Skill, Product, Match, UserSkill } from '../types';
import { MOCK_PRODUCTS } from '../constants';
import SkillTag from './SkillTag';
import Avatar from './Avatar';
import { generateGoogleCalendarLink, downloadIcsFile } from '../utils/calendar';


interface ProfileCardProps {
  user: User;
  currentUser: User;
  onConnect?: (userId: number) => void;
  matchDetails?: Match;
  onUpdateStatus?: (partnerId: number, status: Match['status']) => void;
  onSessionProposalResponse?: (partnerId: number, response: 'accepted' | 'declined') => void;
  onRateSession?: (partnerId: number, rating: number) => void;
  allSkills: Skill[];
}

const statusConfig = {
    'not-started': { text: 'Not Started', color: 'bg-gray-400', buttonText: 'Start Swap', nextStatus: 'in-progress' },
    'in-progress': { text: 'In Progress', color: 'bg-yellow-500', buttonText: 'Mark as Complete', nextStatus: 'completed' },
    'completed': { text: 'Completed', color: 'bg-green-500', buttonText: null, nextStatus: null },
};

const Star: React.FC<{
    filled: boolean;
    onClick?: () => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
}> = ({ filled, onClick, onMouseEnter, onMouseLeave }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={`h-6 w-6 cursor-pointer ${filled ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-500'}`} 
        viewBox="0 0 20 20" 
        fill="currentColor"
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
    >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);


const InteractiveStarRating: React.FC<{ onRate: (rating: number) => void }> = ({ onRate }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);

    return (
        <div className="flex flex-col items-center">
            <div className="flex" onMouseLeave={() => setHoverRating(0)}>
                {[1, 2, 3, 4, 5].map(star => (
                    <Star
                        key={star}
                        filled={(hoverRating || rating) >= star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                    />
                ))}
            </div>
            {rating > 0 && (
                <button
                    onClick={() => onRate(rating)}
                    className="mt-3 text-xs font-bold py-1 px-3 rounded-md transition-colors bg-blue-600 text-white hover:bg-blue-700"
                >
                    Submit Rating
                </button>
            )}
        </div>
    );
};

const ReadOnlyStarRating: React.FC<{ rating: number }> = ({ rating }) => (
    <div className="flex">
        {[1, 2, 3, 4, 5].map(star => (
            <Star key={star} filled={rating >= star} />
        ))}
    </div>
);


const ProfileCard: React.FC<ProfileCardProps> = ({ user, currentUser, onConnect, matchDetails, onUpdateStatus, onSessionProposalResponse, onRateSession, allSkills }) => {
  const isConnected = currentUser.matches.some(m => m.userId === user.id);
  const recommendedProducts = MOCK_PRODUCTS.filter(p => user.skillsToTeach.some(s => s.id === p.skillId));
  
  const isSkillMatch = (skillId: number, skillsList: (Skill | UserSkill)[]) => {
      return skillsList.some(s => s.id === skillId);
  }

  const currentStatusConfig = matchDetails ? statusConfig[matchDetails.status] : null;
  const proposal = matchDetails?.sessionProposal;

  const handleAddToCalendar = (type: 'google' | 'ics') => {
    if (!matchDetails?.scheduledSession) return;
    
    const userSkill = currentUser.skillsToTeach.find(s => user.skillsToLearn.some(ps => ps.id === s.id))?.name || 'a skill';
    const partnerSkill = user.skillsToTeach.find(s => currentUser.skillsToLearn.some(cs => cs.id === s.id))?.name || 'a skill';

    const event = {
        title: `${partnerSkill} Session with ${user.name}`,
        description: `A SkillSwap session.\n\nYou are learning: ${partnerSkill}.\nYou are teaching: ${userSkill}.`,
        startTime: new Date(matchDetails.scheduledSession),
        endTime: new Date(new Date(matchDetails.scheduledSession).getTime() + 60 * 60 * 1000), // Assume 1 hour
    };

    if (type === 'google') {
        window.open(generateGoogleCalendarLink(event), '_blank');
    } else {
        downloadIcsFile(event);
    }
  };

  return (
    <div className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700 transition-transform hover:scale-105 duration-300 flex flex-col`}>
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => {
            if (window.confirm(`Are you sure you want to report ${user.name}? This action cannot be undone.`)) {
              alert(`${user.name} has been reported for review. Thank you for helping keep SkillSwap safe.`);
            }
          }}
          className="p-2 rounded-full bg-gray-100/50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 hover:bg-gray-200 hover:text-red-500 dark:hover:bg-gray-700 dark:hover:text-red-400 transition-colors"
          aria-label={`Report ${user.name}`}
          title="Report user"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
            </svg>
        </button>
      </div>
      <div className="p-6 flex-grow flex flex-col">
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
                    <div className="flex items-center space-x-2">
                        <p className="text-sm font-semibold text-blue-500">Level {user.level}</p>
                        {user.totalRatings > 0 && (
                            <div className="flex items-center text-xs font-bold text-yellow-600 dark:text-yellow-400" title={`Teacher Rating: ${user.teacherRating?.toFixed(1)} out of 5 stars from ${user.totalRatings} ratings`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-0.5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                <span>{user.teacherRating?.toFixed(1)}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
        
        <div className="mb-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${user.xp}%` }}></div>
            </div>
            <p className="text-xs text-right text-gray-500 dark:text-gray-400 mt-1">{user.xp}/100 XP to next level</p>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm flex-grow">{user.bio}</p>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">Wants to Learn:</h4>
            <div className="flex flex-wrap gap-2">
              {user.skillsToLearn.map(skill => (
                <SkillTag key={skill.id} skill={skill} type="learn" isHighlighted={isSkillMatch(skill.id, currentUser.skillsToTeach)} />
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">Can Teach:</h4>
            <div className="flex flex-wrap gap-2">
              {user.skillsToTeach.map(skill => (
                <SkillTag 
                    key={skill.id} 
                    skill={skill} 
                    type="teach" 
                    isHighlighted={isSkillMatch(skill.id, currentUser.skillsToLearn)} 
                    isVerified={user.verifiedSkills.includes(skill.id)}
                />
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

      {matchDetails && (onUpdateStatus || onSessionProposalResponse) && (
        <div className="bg-gray-100 dark:bg-gray-800/50 p-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
            <h5 className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Swap Progress
            </h5>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <span className={`w-3 h-3 rounded-full ${currentStatusConfig?.color}`}></span>
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{currentStatusConfig?.text}</span>
                </div>
                {onUpdateStatus && currentStatusConfig?.buttonText && currentStatusConfig.nextStatus && (
                     <button
                        onClick={() => onUpdateStatus(user.id, currentStatusConfig.nextStatus as Match['status'])}
                        className="text-xs font-bold py-1 px-2.5 rounded-md transition-colors duration-300 bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800/50 focus:ring-blue-500"
                    >
                        {currentStatusConfig.buttonText}
                    </button>
                )}
            </div>
            
            {proposal && proposal.status === 'pending' && onSessionProposalResponse && (
                <div className="bg-yellow-100 dark:bg-yellow-900/50 p-3 rounded-lg space-y-2">
                    <p className="text-xs font-semibold text-yellow-800 dark:text-yellow-200">
                        {proposal.proposerId === currentUser.id ? 'You proposed a session:' : `${user.name} proposed a session:`}
                        <strong className="block mt-1 text-yellow-900 dark:text-yellow-100">{new Date(proposal.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</strong>
                    </p>
                    {proposal.proposerId !== currentUser.id && (
                        <div className="flex space-x-2 pt-1">
                            <button onClick={() => onSessionProposalResponse(user.id, 'accepted')} className="flex-1 text-xs font-bold py-1 px-2.5 rounded-md transition-colors bg-green-500 text-white hover:bg-green-600">Accept</button>
                            <button onClick={() => onSessionProposalResponse(user.id, 'declined')} className="flex-1 text-xs font-bold py-1 px-2.5 rounded-md transition-colors bg-red-500 text-white hover:bg-red-600">Decline</button>
                        </div>
                    )}
                </div>
            )}

            {matchDetails.scheduledSession && (
                 <div className="bg-gray-200 dark:bg-gray-700 px-3 py-2 rounded-md space-y-2">
                    <div className="flex items-center text-xs text-gray-600 dark:text-gray-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <strong>Confirmed:</strong> <span className="ml-1.5">{new Date(matchDetails.scheduledSession).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                    </div>
                     <div className="flex items-center space-x-2">
                        <button onClick={() => handleAddToCalendar('google')} className="flex-1 text-xs font-semibold py-1 px-2 rounded-md bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors">Add to Google</button>
                        <button onClick={() => handleAddToCalendar('ics')} className="flex-1 text-xs font-semibold py-1 px-2 rounded-md bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors">Download .ics</button>
                    </div>
                </div>
            )}
             {matchDetails.status === 'completed' && onRateSession && (
                <div className="bg-gray-200 dark:bg-gray-700 px-3 py-2 rounded-md">
                    <h6 className="text-xs font-semibold text-center text-gray-700 dark:text-gray-300 mb-2">Session Feedback</h6>
                    {matchDetails.rating ? (
                        <div className="text-center">
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">You rated this session:</p>
                            <div className="flex justify-center">
                                <ReadOnlyStarRating rating={matchDetails.rating} />
                            </div>
                        </div>
                    ) : (
                         <div className="text-center">
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Rate your session with {user.name}:</p>
                            <InteractiveStarRating onRate={(rating) => onRateSession(user.id, rating)} />
                        </div>
                    )}
                </div>
            )}
        </div>
      )}

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