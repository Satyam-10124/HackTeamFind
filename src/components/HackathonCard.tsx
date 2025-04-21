import React from 'react';
import { Calendar, MapPin, Users, Award, ExternalLink, Clock, Tag, Globe } from 'lucide-react';
import { format } from 'date-fns';
import { Hackathon } from '../types';

interface HackathonCardProps {
  hackathon: Hackathon;
}

const HackathonCard: React.FC<HackathonCardProps> = ({ hackathon }) => {
  const startDate = new Date(hackathon.startDate);
  const endDate = new Date(hackathon.endDate);
  const deadlineDate = new Date(hackathon.registrationDeadline);
  
  const isUpcoming = new Date() < startDate;
  const isRegistrationOpen = new Date() < deadlineDate;
  
  // Calculate days remaining until registration deadline
  const daysUntilDeadline = Math.ceil((deadlineDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-200 dark:border-gray-700">
      <div className="relative">
        {hackathon.isOnline && (
          <span className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-semibold px-2 py-1 m-2 rounded-full">
            <div className="flex items-center">
              <Globe className="h-3 w-3 mr-1" />
              Online
            </div>
          </span>
        )}
        {isUpcoming && (
          <span className="absolute top-0 left-0 bg-green-500 text-white text-xs font-semibold px-2 py-1 m-2 rounded-full">
            Upcoming
          </span>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex items-center">
          <img
            src={hackathon.organizerLogo}
            alt={hackathon.organizer}
            className="h-10 w-10 object-cover rounded-full border border-gray-200 dark:border-gray-700"
          />
          <div className="ml-3">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{hackathon.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">by {hackathon.organizer}</p>
          </div>
        </div>
        
        <div className="mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{hackathon.description}</p>
        </div>
        
        <div className="mt-4 space-y-2">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <Calendar className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500" />
            <span>
              {format(startDate, 'MMM d, yyyy')} - {format(endDate, 'MMM d, yyyy')}
            </span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <MapPin className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500" />
            <span>{hackathon.location}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <Users className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500" />
            <span>Team Size: {hackathon.minTeamSize} - {hackathon.maxTeamSize} members</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <Award className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500" />
            <span>{hackathon.prizes[0]}</span>
          </div>
          
          {isRegistrationOpen && (
            <div className="flex items-center text-sm text-primary-600 dark:text-primary-400">
              <Clock className="h-4 w-4 mr-2" />
              <span>Registration closes in {daysUntilDeadline} days</span>
            </div>
          )}
        </div>
        
        <div className="mt-4 flex flex-wrap gap-1">
          {hackathon.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs px-2 py-1 rounded-full transition-colors duration-200"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <div className="mt-6">
          {isRegistrationOpen ? (
            <div className="space-y-2">
              <a
                href={hackathon.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 w-full justify-center transition-colors duration-200"
              >
                Register Now
                <ExternalLink className="h-4 w-4 ml-1" />
              </a>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 w-full justify-center transition-colors duration-200">
                <Users className="h-4 w-4 mr-1" />
                Find Teammates
              </button>
            </div>
          ) : (
            <a
              href={hackathon.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 w-full justify-center transition-colors duration-200"
            >
              Registration Closed
              <ExternalLink className="h-4 w-4 ml-1" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default HackathonCard;