
import React from 'react';
import { Skill } from '../types';

interface SkillTagProps {
  skill: Skill;
  type: 'teach' | 'learn';
  isHighlighted?: boolean;
}

const SkillTag: React.FC<SkillTagProps> = ({ skill, type, isHighlighted = false }) => {
  const baseClasses = "px-3 py-1 text-xs font-semibold rounded-full transition-all duration-200";
  
  const typeClasses = {
    teach: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    learn: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
  };

  const highlightClasses = isHighlighted 
    ? (type === 'teach' ? 'ring-2 ring-blue-500 scale-105' : 'ring-2 ring-indigo-500 scale-105') 
    : '';

  return (
    <span className={`${baseClasses} ${typeClasses[type]} ${highlightClasses}`}>
      {skill.name}
    </span>
  );
};

export default SkillTag;
