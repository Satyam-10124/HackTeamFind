import React from 'react';
import { Link } from 'react-router-dom';
import { Users, ArrowRight, Calendar, Target } from 'lucide-react';
import { Team, User, Hackathon } from '../types';

interface TeamCardProps {
  team: Team;
  members: User[];
  hackathon?: Hackathon;
  onJoin?: () => void;
}

const TeamCard: React.FC<TeamCardProps> = ({ team, members, hackathon, onJoin }) => {
  const leader = members.find(member => member.id === team.leader);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div className="bg-primary-100 dark:bg-primary-900/30 rounded-full p-2">
              <Users className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{team.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Led by {leader?.name || 'Unknown'}
              </p>
            </div>
          </div>
          <div className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs font-semibold text-gray-700 dark:text-gray-300">
            {members.length}/{team.lookingForRoles.length + members.length} Members
          </div>
        </div>
        
        {hackathon && (
          <div className="mt-4 flex items-center">
            <Calendar className="h-4 w-4 text-gray-400 mr-1.5" />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              For {hackathon.name} ({new Date(hackathon.startDate).toLocaleDateString()})
            </span>
          </div>
        )}
        
        <div className="mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{team.description}</p>
        </div>
        
        <div className="mt-4">
          <div className="flex items-center mb-2">
            <Target className="h-4 w-4 text-primary-500 mr-1.5" />
            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Looking for
            </h4>
          </div>
          <div className="flex flex-wrap gap-1">
            {team.lookingForRoles.map((role, index) => (
              <span 
                key={index}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary-100 dark:bg-secondary-900/30 text-secondary-800 dark:text-secondary-300"
              >
                {role}
              </span>
            ))}
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex items-center mb-2">
            <Users className="h-4 w-4 text-primary-500 mr-1.5" />
            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Team Members
            </h4>
          </div>
          <div className="flex -space-x-2 overflow-hidden">
            {members.map((member) => (
              <img
                key={member.id}
                src={member.avatar}
                alt={member.name}
                className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-800"
                title={member.name}
              />
            ))}
            {team.lookingForRoles.length > 0 && (
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 ring-2 ring-white dark:ring-gray-800 text-xs font-medium text-gray-500 dark:text-gray-400">
                +{team.lookingForRoles.length}
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-6 flex justify-between items-center">
          <Link
            to={`/teams/${team.id}`}
            className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 text-sm font-medium inline-flex items-center transition-colors duration-200"
          >
            Team Details
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
          
          {onJoin && team.lookingForRoles.length > 0 && (
            <button
              onClick={onJoin}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
            >
              Request to Join
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamCard;