import React, { useState, useRef, useEffect } from 'react';
import { User } from '../types';
import SkillTag from './SkillTag';
import Avatar from './Avatar';

interface SwipeCardProps {
  user: User;
  currentUser: User;
  onSwipe: (direction: 'left' | 'right') => void;
  isInteractive: boolean;
}

const SwipeCard: React.FC<SwipeCardProps> = ({ user, currentUser, onSwipe, isInteractive }) => {
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
  
  const isSkillMatch = (skill, skillsList) => skillsList.some(s => s.id === skill.id);

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
            <img src={user.avatar.replace('/200', '/400')} alt={user.name} className="w-full h-full object-cover"/>
            <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
                <h2 className="text-3xl font-bold">{user.name}</h2>
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
                    <SkillTag key={skill.id} skill={skill} type="teach" isHighlighted={isSkillMatch(skill, currentUser.skillsToLearn)} />
                ))}
                </div>
            </div>
            <div>
                <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-2 text-sm">Wants to Learn:</h4>
                <div className="flex flex-wrap gap-2">
                {user.skillsToLearn.map(skill => (
                    <SkillTag key={skill.id} skill={skill} type="learn" isHighlighted={isSkillMatch(skill, currentUser.skillsToTeach)} />
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