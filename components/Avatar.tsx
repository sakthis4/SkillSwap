
import React from 'react';
import { User } from '../types';

interface AvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg';
  showStatus?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({ user, size = 'md', showStatus = false }) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
  };

  const statusSizeClasses = {
      sm: 'h-2 w-2 bottom-0 right-0',
      md: 'h-2.5 w-2.5 bottom-0 right-0',
      lg: 'h-3.5 w-3.5 bottom-0.5 right-0.5',
  }

  const statusColor = user.status === 'online' ? 'bg-green-500' : 'bg-gray-400';

  return (
    <div className="relative flex-shrink-0">
      <img
        className={`rounded-full object-cover ${sizeClasses[size]}`}
        src={user.avatar}
        alt={user.name}
      />
      {showStatus && (
         <span className={`absolute ${statusSizeClasses[size]} rounded-full ${statusColor} border-2 border-white dark:border-gray-800`}></span>
      )}
    </div>
  );
};

export default Avatar;
