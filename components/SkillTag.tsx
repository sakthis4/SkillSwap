
import React from 'react';
import { Skill, UserSkill } from '../types';

interface SkillTagProps {
  skill: Skill | UserSkill;
  type: 'teach' | 'learn';
  isHighlighted?: boolean;
  isVerified?: boolean;
}

const VerifiedIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1 inline-block text-green-600 dark:text-green-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 18.333a11.954 11.954 0 007.834-13.334A1.995 1.995 0 0016 1c-2.31 0-4.438.78-6 2.053C8.438 1.78 6.31 1 4 1a1.995 1.995 0 00-1.834 3.999zM10 11.857l-3.218 1.692a.5.5 0 01-.725-.529l.614-3.582-2.6-2.534a.5.5 0 01.277-.852l3.598-.522L9.63 2.91a.5.5 0 01.894 0l1.608 3.268 3.598.522a.5.5 0 01.277.852l-2.6 2.534.614 3.582a.5.5 0 01-.725.529L10 11.857z" clipRule="evenodd" />
    </svg>
);

const StarIcon: React.FC<{ filled: boolean }> = ({ filled }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 inline-block ${filled ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-500'}`} viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

const SkillTag: React.FC<SkillTagProps> = ({ skill, type, isHighlighted = false, isVerified = false }) => {
  const proficiency = (skill as UserSkill).proficiency;

  const baseClasses = "px-3 py-1 text-xs font-semibold rounded-full transition-all duration-200 flex items-center";
  
  const typeClasses = {
    teach: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    learn: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
  };

  const highlightClasses = isHighlighted 
    ? (type === 'teach' ? 'ring-2 ring-blue-500 scale-105' : 'ring-2 ring-indigo-500 scale-105') 
    : '';

  return (
    <span className={`${baseClasses} ${typeClasses[type]} ${highlightClasses}`}>
      {isVerified && <VerifiedIcon />}
      {skill.name}
      {type === 'teach' && proficiency && (
        <span className="ml-2 flex items-center" title={`Proficiency: ${proficiency}/3`}>
            {[1, 2, 3].map(star => <StarIcon key={star} filled={star <= proficiency} />)}
        </span>
      )}
    </span>
  );
};

export default SkillTag;