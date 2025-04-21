import React, { useState, useEffect } from 'react';
import { Filter, Search, X, Sliders, MapPin, CheckCheck, Clock, Sparkles } from 'lucide-react';
import { useAppStore } from '../store';
import UserCard from '../components/UserCard';
import SkillBadge from '../components/SkillBadge';
import { skills } from '../data/mockData';
import { Skill } from '../types';
import MatchScore from '../components/MatchScore';

const SearchPage: React.FC = () => {
  const { users, currentUser, filterUsers, filteredUsers } = useAppStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
  const [eventType, setEventType] = useState<'online' | 'offline' | 'hybrid' | ''>('');
  const [availability, setAvailability] = useState<string[]>([]);
  const [experienceLevels, setExperienceLevels] = useState<string[]>([]);
  const [lookingForTeam, setLookingForTeam] = useState<boolean | undefined>(undefined);
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'recommendations'>('all');
  const [sortBy, setSortBy] = useState<'match' | 'rating' | 'recent'>('match');

  // Group skills by category for better organization
  const skillsByCategory = skills.reduce((acc, skill) => {
    const category = skill.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  useEffect(() => {
    // Apply filters whenever they change
    filterUsers({
      skills: selectedSkills.map(s => s.name),
      location,
      eventType: eventType as any,
      availability,
      experience: experienceLevels,
      lookingForTeam,
    });
  }, [filterUsers, selectedSkills, location, eventType, availability, experienceLevels, lookingForTeam]);

  const toggleSkill = (skill: Skill) => {
    if (selectedSkills.some(s => s.id === skill.id)) {
      setSelectedSkills(selectedSkills.filter(s => s.id !== skill.id));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const toggleAvailability = (time: string) => {
    if (availability.includes(time)) {
      setAvailability(availability.filter(t => t !== time));
    } else {
      setAvailability([...availability, time]);
    }
  };

  const toggleExperienceLevel = (level: string) => {
    if (experienceLevels.includes(level)) {
      setExperienceLevels(experienceLevels.filter(l => l !== level));
    } else {
      setExperienceLevels([...experienceLevels, level]);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setLocation('');
    setSelectedSkills([]);
    setEventType('');
    setAvailability([]);
    setExperienceLevels([]);
    setLookingForTeam(undefined);
  };

  // Filter users by search term (name, bio, or skills)
  const searchedUsers = searchTerm
    ? filteredUsers.filter(
        user =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.skills.some(skill =>
            skill.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
      )
    : filteredUsers;

  // Get recommended users based on match percentage
  const recommendedUsers = searchedUsers
    .filter(user => user.id !== currentUser?.id && (user.matchPercentage || 0) > 30)
    .sort((a, b) => (b.matchPercentage || 0) - (a.matchPercentage || 0));

  // Sort users based on selected criteria
  const sortedUsers = [...searchedUsers].sort((a, b) => {
    if (sortBy === 'match') {
      return (b.matchPercentage || 0) - (a.matchPercentage || 0);
    } else if (sortBy === 'rating') {
      return b.rating - a.rating;
    }
    // Default: sort by most recent (placeholder - would be by join date in real app)
    return 0;
  });

  // Final list of users to display
  const displayUsers = activeTab === 'recommendations' ? recommendedUsers : sortedUsers;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
          Find Your Perfect Teammates
        </h1>
        <p className="mt-3 text-xl text-gray-500 dark:text-gray-400 sm:mt-4">
          Connect with talented Web3 developers who match your skills and interests.
        </p>
      </div>

      <div className="mb-8 relative">
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 pr-12 py-4 sm:text-sm border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            placeholder="Search by name, skills, or keywords..."
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-gray-700 hover:bg-primary-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
            >
              <Sliders className="h-4 w-4 mr-1" />
              Filters
            </button>
          </div>
        </div>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex space-x-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
              activeTab === 'all'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            All Developers
          </button>
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
              activeTab === 'recommendations'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center">
              <Sparkles className="h-4 w-4 mr-1 text-yellow-500" />
              Recommended
            </div>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-sm border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="match">Best Match</option>
            <option value="rating">Highest Rating</option>
            <option value="recent">Most Recent</option>
          </select>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-8 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Advanced Filters</h2>
            <button
              onClick={clearFilters}
              className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 flex items-center transition-colors duration-200"
            >
              <X className="h-4 w-4 mr-1" /> Reset Filters
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  Location
                </div>
              </label>
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                placeholder="City, State, or Country"
              />
            </div>

            <div>
              <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  Event Type Preference
                </div>
              </label>
              <select
                id="eventType"
                value={eventType}
                onChange={(e) => setEventType(e.target.value as any)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-sm border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <option value="">Any event type</option>
                <option value="online">Online</option>
                <option value="offline">In-person</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <div className="flex items-center">
                <CheckCheck className="h-4 w-4 mr-1" />
                Skills
              </div>
            </label>
            <div className="space-y-4">
              {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
                <div key={category} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                  <h4 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2">
                    {category}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {categorySkills.map((skill) => (
                      <SkillBadge
                        key={skill.id}
                        skill={skill}
                        onClick={() => toggleSkill(skill)}
                        selected={selectedSkills.some(s => s.id === skill.id)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Availability
                </div>
              </label>
              <div className="flex flex-wrap gap-2">
                {['Weekdays', 'Weekends', 'Evenings', 'Mornings'].map((time) => (
                  <span
                    key={time}
                    onClick={() => toggleAvailability(time)}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium cursor-pointer transition-colors duration-200 ${
                      availability.includes(time)
                        ? 'bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-300 border border-primary-200 dark:border-primary-800 ring-2 ring-primary-500 dark:ring-primary-600 ring-offset-1 dark:ring-offset-gray-900'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {time}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <div className="flex items-center">
                  <Zap className="h-4 w-4 mr-1" />
                  Experience Level
                </div>
              </label>
              <div className="flex flex-wrap gap-2">
                {['beginner', 'intermediate', 'advanced', 'expert'].map((level) => (
                  <span
                    key={level}
                    onClick={() => toggleExperienceLevel(level)}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium cursor-pointer capitalize transition-colors duration-200 ${
                      experienceLevels.includes(level)
                        ? 'bg-secondary-100 dark:bg-secondary-900 text-secondary-800 dark:text-secondary-300 border border-secondary-200 dark:border-secondary-800 ring-2 ring-secondary-500 dark:ring-secondary-600 ring-offset-1 dark:ring-offset-gray-900'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {level}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Looking for Team
            </label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="lookingForTeam"
                  checked={lookingForTeam === true}
                  onChange={() => setLookingForTeam(true)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-700"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Yes</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="lookingForTeam"
                  checked={lookingForTeam === false}
                  onChange={() => setLookingForTeam(false)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-700"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">No</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="lookingForTeam"
                  checked={lookingForTeam === undefined}
                  onChange={() => setLookingForTeam(undefined)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-700"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">All</span>
              </label>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end">
            <button
              onClick={() => setShowFilters(false)}
              className="px-4 py-2 text-sm font-medium text-primary-700 dark:text-primary-400 bg-white dark:bg-gray-800 border border-primary-300 dark:border-gray-700 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
          {displayUsers.length} developers found
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayUsers.map((user) => (
          <div key={user.id} className="relative">
            {user.matchPercentage && user.matchPercentage > 0 && (
              <div className="absolute top-3 right-3 z-10">
                <MatchScore score={user.matchPercentage} size="sm" />
              </div>
            )}
            <UserCard user={user} onConnect={() => {}} />
          </div>
        ))}

        {displayUsers.length === 0 && (
          <div className="col-span-3 text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No developers found matching your criteria. Try adjusting your filters.
            </p>
            {(selectedSkills.length > 0 || location || eventType || availability.length > 0 || experienceLevels.length > 0 || lookingForTeam !== undefined) && (
              <button
                onClick={clearFilters}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;