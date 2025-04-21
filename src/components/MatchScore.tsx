import React from 'react';
import { BarChart, CheckCircle } from 'lucide-react';
import Zap from './Zap';

interface MatchScoreProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const MatchScore: React.FC<MatchScoreProps> = ({ 
  score, 
  size = 'md',
  showLabel = true 
}) => {
  // Determine the color based on match score
  const getColor = () => {
    if (score >= 80) return 'text-neo-green';
    if (score >= 60) return 'text-neo-blue';
    if (score >= 40) return 'text-neo-yellow';
    return 'text-gray-500 dark:text-gray-400';
  };
  
  // Determine label text based on match score
  const getLabel = () => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    if (score >= 40) return 'Fair Match';
    return 'Low Match';
  };
  
  // Determine icon based on match score
  const getIcon = () => {
    if (score >= 80) return <CheckCircle className="mr-1" />;
    if (score >= 60) return <Zap className="mr-1" />;
    return <BarChart className="mr-1" />;
  };
  
  // Determine size based on prop
  const getSize = () => {
    switch (size) {
      case 'sm': return 'text-xs flex items-center';
      case 'lg': return 'text-lg flex items-center';
      default: return 'text-sm flex items-center';
    }
  };

  return (
    <div className={`${getSize()} ${getColor()} font-medium`}>
      {getIcon()}
      <span className="mr-1">{score}%</span>
      {showLabel && <span>{getLabel()}</span>}
    </div>
  );
};

export default MatchScore;