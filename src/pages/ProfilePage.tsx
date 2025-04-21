import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Mail, MessageSquare, ExternalLink, Github, Linkedin, Twitter, Star } from 'lucide-react';
import { useAppStore } from '../store';
import SkillBadge from '../components/SkillBadge';
import { User } from '../types';

const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { users, currentUser } = useAppStore();
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    if (id) {
      const foundUser = users.find(u => u.id === id);
      if (foundUser) {
        setUser(foundUser);
      }
    }
  }, [id, users]);
  
  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">User not found</h2>
          <p className="mt-2 text-gray-600">The user you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center">
            <img
              className="h-24 w-24 rounded-full object-cover border-4 border-primary-100"
              src={user.avatar}
              alt={user.name}
            />
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <div className="flex items-center text-gray-500 mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{user.location}</span>
              </div>
              <div className="flex items-center mt-1">
                <Star className="h-4 w-4 text-yellow-400" />
                <span className="ml-1 text-sm text-gray-600">{user.rating.toFixed(1)} rating</span>
              </div>
            </div>
          </div>
          
          {currentUser && currentUser.id !== user.id && (
            <div className="mt-4 md:mt-0 flex space-x-3">
              <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                <MessageSquare className="h-4 w-4 mr-2" />
                Send Message
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                <Mail className="h-4 w-4 mr-2" />
                Invite to Team
              </button>
            </div>
          )}
        </div>
        
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium text-gray-900">About</h3>
          <p className="mt-1 text-gray-600">{user.bio}</p>
        </div>
        
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium text-gray-900">Skills</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {user.skills.map((skill) => (
              <SkillBadge key={skill.id} skill={skill} />
            ))}
          </div>
        </div>
        
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium text-gray-900">Hackathon Preferences</h3>
          <dl className="mt-2 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Event Type</dt>
              <dd className="mt-1 text-sm text-gray-900">{user.preferences.eventType}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Timezone</dt>
              <dd className="mt-1 text-sm text-gray-900">{user.preferences.timezone}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Team Roles</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {user.preferences.teamRole.join(', ')}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Availability</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {user.preferences.availability.join(', ')}
              </dd>
            </div>
          </dl>
        </div>
        
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium text-gray-900">Past Projects</h3>
          <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {user.pastProjects.map((project) => (
              <div key={project.id} className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-bold text-gray-900">{project.name}</h4>
                <p className="mt-1 text-sm text-gray-600">{project.description}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {project.technologies.map((tech, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center text-sm text-primary-600 hover:text-primary-800"
                  >
                    View Project
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium text-gray-900">Connect with {user.name}</h3>
          <div className="mt-4 flex space-x-4">
            {user.githubUrl && (
              <a
                href={user.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-500"
              >
                <Github className="h-6 w-6" />
              </a>
            )}
            {user.linkedinUrl && (
              <a
                href={user.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-500"
              >
                <Linkedin className="h-6 w-6" />
              </a>
            )}
            {user.twitterUrl && (
              <a
                href={user.twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-500"
              >
                <Twitter className="h-6 w-6" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;