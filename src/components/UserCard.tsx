import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, MessageSquare, Star, UserPlus, Calendar, Zap } from 'lucide-react';
import { User } from '../types';
import SkillBadge from './SkillBadge';
import MatchScore from './MatchScore';

interface UserCardProps {
  user: User;
  onConnect?: () => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onConnect }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex items-center">
          <img
            src={user.avatar}
            alt={user.name}
            className="h-16 w-16 rounded-full object-cover border-2 border-primary-200 dark:border-primary-800"
          />
          <div className="ml-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{user.name}</h3>
            <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{user.location}</span>
            </div>
            <div className="flex items-center mt-1">
              <Star className="h-4 w-4 text-yellow-400" />
              <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">{user.rating.toFixed(1)}</span>
            </div>
          </div>
        </div>
        
        {user.matchPercentage && user.matchPercentage > 0 && (
          <div className="mt-3 px-3 py-1.5 bg-primary-50 dark:bg-primary-900/20 rounded-md border border-primary-100 dark:border-primary-800/30">
            <MatchScore score={user.matchPercentage} />
          </div>
        )}
        
        <div className="mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{user.bio}</p>
        </div>
        
        <div className="mt-4">
          <div className="flex items-center mb-2">
            <Zap className="h-4 w-4 text-primary-500 mr-1.5" />
            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Top Skills
            </h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {user.skills.slice(0, 3).map((skill) => (
              <SkillBadge key={skill.id} skill={skill} />
            ))}
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex items-center mb-2">
            <Calendar className="h-4 w-4 text-primary-500 mr-1.5" />
            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Availability
            </h4>
          </div>
          <div className="flex flex-wrap gap-1">
            {user.preferences.availability.map((time, index) => (
              <span 
                key={index}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              >
                {time}
              </span>
            ))}
          </div>
        </div>
        
        <div className="mt-6 flex justify-between">
          <Link
            to={`/profile/${user.id}`}
            className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 text-sm font-medium transition-colors duration-200"
          >
            View Full Profile
          </Link>
          
          {onConnect && (
            <button
              onClick={onConnect}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
            >
              <UserPlus className="h-4 w-4 mr-1" />
              Connect
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserCard;