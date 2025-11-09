

import React, { useState, useRef, useEffect } from 'react';
import { User, Skill, UserSkill } from '../types';
import SkillTag from './SkillTag';
import Avatar from './Avatar';

interface SwipeCardProps {
  user: User;
  currentUser: User;
  onSwipe: (direction: 'left' | 'right') => void;
  isInteractive: boolean;
  allSkills: Skill[];
}

const SwipeCard: React.FC<SwipeCardProps> = ({ user, currentUser, onSwipe, isInteractive, allSkills }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [vote, setVote] = useState<'like' | 'pass' | null>(null);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    const point = 'touches' in e ? e.touches[0] : e;
    setStartPos({ x: point.clientX, y: point.clientY });
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !cardRef.current) return;
    const point = 'touches' in e ? e.touches[0] : e;
    const deltaX = point.clientX - startPos.x;
    const deltaY = point.clientY - startPos.y;
    setPosition({ x: deltaX, y: deltaY });

    if (deltaX > 50) setVote('like');
    else if (deltaX < -50) setVote('pass');
    else setVote(null);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (position.x > 100) {
      onSwipe('right');
    } else if (position.x < -100) {
      onSwipe('left');
    } else {
      setPosition({ x: 0, y: 0 });
    }
    setVote(null);
  };
  
  const rotation = position.x / 15;
  const cardStyle = {
    transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg)`,
    transition: isDragging ? 'none' : 'transform 0.3s ease-out',
  };
  
  const isSkillMatch = (skillId: number, skillsList: (Skill | UserSkill)[]) => skillsList.some(s => s.id === skillId);

  return (
    <div
      ref={cardRef}
      style={cardStyle}
      className={`absolute w-full h-full ${isInteractive ? 'cursor-grab active:cursor-grabbing' : ''}`}
      onMouseDown={isInteractive ? handleDragStart : undefined}
      onTouchStart={isInteractive ? handleDragStart : undefined}
      onMouseMove={isInteractive ? handleDragMove : undefined}
      onTouchMove={isInteractive ? handleDragMove : undefined}
      onMouseUp={isInteractive ? handleDragEnd : undefined}
      onMouseLeave={isInteractive ? handleDragEnd : undefined}
      onTouchEnd={isInteractive ? handleDragEnd : undefined}
    >
      <div className="relative w-full h-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden flex flex-col">
        {/* Vote Overlay */}
        {vote && (
            <div className={`absolute top-10 left-10 text-4xl font-bold border-4 rounded-xl p-2 transform -rotate-12 ${vote === 'like' ? 'text-green-500 border-green-500' : 'text-red-500 border-red-500'}`}>
                {vote === 'like' ? 'LIKE' : 'PASS'}
            </div>
        )}
        
        <div className="relative h-1/2">
            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover"/>
            <div className="absolute top-4 right-4 z-10">
                <button
                onClick={() => {
                    if (window.confirm(`Are you sure you want to report ${user.name}?`)) {
                    alert(`${user.name} has been reported. Thank you for your feedback.`);
                    }
                }}
                className="p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
                aria-label={`Report ${user.name}`}
                title="Report user"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
            <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
                <div className="flex items-baseline space-x-2">
                    <h2 className="text-3xl font-bold">{user.name}</h2>
                    {(user.totalRatings ?? 0) > 0 && (
                        <div className="flex items-center bg-yellow-400 text-black px-2 py-0.5 rounded-md" title={`Teacher Rating: ${user.teacherRating?.toFixed(1)} from ${user.totalRatings} ratings`}>
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                           <span className="font-bold text-sm">{user.teacherRating?.toFixed(1)}</span>
                        </div>
                    )}
                </div>
                <p className="font-semibold">Level {user.level}</p>
            </div>
        </div>
        <div className="p-6 flex-grow flex flex-col justify-between">
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{user.bio}</p>
          <div className="space-y-4">
             <div>
                <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-2 text-sm">Can Teach:</h4>
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
                <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-2 text-sm">Wants to Learn:</h4>
                <div className="flex flex-wrap gap-2">
                {user.skillsToLearn.map(skill => (
                    <SkillTag key={skill.id} skill={skill} type="learn" isHighlighted={isSkillMatch(skill.id, currentUser.skillsToTeach)} />
                ))}
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwipeCard;