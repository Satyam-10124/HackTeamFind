import React from 'react';
import { Skill } from '../types';

interface SkillBadgeProps {
  skill: Skill;
  onClick?: () => void;
  selected?: boolean;
}

const SkillBadge: React.FC<SkillBadgeProps> = ({ skill, onClick, selected }) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'frontend':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'backend':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800';
      case 'blockchain':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'design':
        return 'bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300 border-pink-200 dark:border-pink-800';
      case 'project management':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700';
    }
  };

  const getLevelDot = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-gray-400 dark:bg-gray-500';
      case 'intermediate':
        return 'bg-blue-500 dark:bg-blue-400';
      case 'advanced':
        return 'bg-green-500 dark:bg-green-400';
      case 'expert':
        return 'bg-yellow-500 dark:bg-yellow-400';
      default:
        return 'bg-gray-400 dark:bg-gray-500';
    }
  };

  const baseClasses = 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border transition-all duration-200';
  const interactiveClasses = onClick ? 'cursor-pointer hover:bg-opacity-80 dark:hover:bg-opacity-80' : '';
  const selectedClasses = selected ? 'ring-2 ring-primary-500 dark:ring-primary-400 ring-offset-1 dark:ring-offset-gray-900' : '';
  const categoryClasses = getCategoryColor(skill.category);
  const combinedClasses = `${baseClasses} ${interactiveClasses} ${selectedClasses} ${categoryClasses}`;

  return (
    <span 
      className={combinedClasses}
      onClick={onClick}
    >
      <span className={`h-2 w-2 rounded-full ${getLevelDot(skill.level)} mr-1`}></span>
      {skill.name}
    </span>
  );
};

export default SkillBadge;