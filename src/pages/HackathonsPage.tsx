import React, { useState } from 'react';
import { useAppStore } from '../store';
import HackathonCard from '../components/HackathonCard';
import { Filter, Calendar, Search, X, MapPin, Globe, Award, Tag, Clock } from 'lucide-react';

const HackathonsPage: React.FC = () => {
  const { hackathons } = useAppStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isOnlineOnly, setIsOnlineOnly] = useState(false);
  const [isUpcomingOnly, setIsUpcomingOnly] = useState(true);
  const [teamSizeRange, setTeamSizeRange] = useState<[number, number]>([1, 10]);
  const [dateRange, setDateRange] = useState<[string, string]>(['', '']);
  
  const allCategories = Array.from(
    new Set(hackathons.flatMap((hackathon) => hackathon.categories))
  );
  
  const allTags = Array.from(
    new Set(hackathons.flatMap((hackathon) => hackathon.tags))
  );
  
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };
  
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  
  const handleTeamSizeChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = parseInt(e.target.value);
    if (isNaN(value)) return;
    
    const newRange = [...teamSizeRange] as [number, number];
    newRange[index] = value;
    setTeamSizeRange(newRange);
  };
  
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newRange = [...dateRange] as [string, string];
    newRange[index] = e.target.value;
    setDateRange(newRange);
  };
  
  // Filter hackathons based on selected filters
  const filteredHackathons = hackathons.filter((hackathon) => {
    // Filter by search term
    if (
      searchTerm &&
      !hackathon.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !hackathon.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !hackathon.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      )
    ) {
      return false;
    }
    
    // Filter by online status
    if (isOnlineOnly && !hackathon.isOnline) {
      return false;
    }
    
    // Filter by upcoming status
    if (isUpcomingOnly && new Date(hackathon.startDate) <= new Date()) {
      return false;
    }
    
    // Filter by categories
    if (
      selectedCategories.length > 0 &&
      !selectedCategories.some((category) =>
        hackathon.categories.includes(category)
      )
    ) {
      return false;
    }
    
    // Filter by tags
    if (
      selectedTags.length > 0 &&
      !selectedTags.some((tag) =>
        hackathon.tags.includes(tag)
      )
    ) {
      return false;
    }
    
    // Filter by team size
    if (
      hackathon.minTeamSize < teamSizeRange[0] ||
      hackathon.maxTeamSize > teamSizeRange[1]
    ) {
      return false;
    }
    
    // Filter by date range
    if (dateRange[0] && new Date(hackathon.startDate) < new Date(dateRange[0])) {
      return false;
    }
    if (dateRange[1] && new Date(hackathon.endDate) > new Date(dateRange[1])) {
      return false;
    }
    
    return true;
  });
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">Upcoming Hackathons</h1>
        <p className="mt-3 text-xl text-gray-500 dark:text-gray-400 sm:mt-4">
          Discover Web3 hackathons from around the world and find your next challenge.
        </p>
      </div>
      
      <div className="mb-8">
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 pr-12 py-4 sm:text-sm border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            placeholder="Search by name, description, or tags..."
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-gray-700 hover:bg-primary-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
            >
              <Filter className="h-4 w-4 mr-1" />
              Filters
            </button>
          </div>
        </div>
      </div>
      
      {showFilters && (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-8 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Filter Hackathons</h2>
            <button
              onClick={() => {
                setSelectedCategories([]);
                setSelectedTags([]);
                setIsOnlineOnly(false);
                setIsUpcomingOnly(true);
                setTeamSizeRange([1, 10]);
                setDateRange(['', '']);
              }}
              className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 flex items-center transition-colors duration-200"
            >
              <X className="h-4 w-4 mr-1" /> Reset Filters
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                <Tag className="h-4 w-4 mr-1 text-gray-500" />
                Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {allCategories.map((category) => (
                  <span
                    key={category}
                    onClick={() => toggleCategory(category)}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium cursor-pointer transition-colors duration-200 ${
                      selectedCategories.includes(category)
                        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 border border-primary-200 dark:border-primary-800/30 ring-2 ring-primary-500 dark:ring-primary-500/30 ring-offset-1 dark:ring-offset-gray-900'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                <Tag className="h-4 w-4 mr-1 text-gray-500" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <span
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium cursor-pointer transition-colors duration-200 ${
                      selectedTags.includes(tag)
                        ? 'bg-secondary-100 dark:bg-secondary-900/30 text-secondary-800 dark:text-secondary-300 border border-secondary-200 dark:border-secondary-800/30 ring-2 ring-secondary-500 dark:ring-secondary-500/30 ring-offset-1 dark:ring-offset-gray-900'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                <Users className="h-4 w-4 mr-1 text-gray-500" />
                Team Size
              </h3>
              <div className="flex items-center space-x-4">
                <input
                  type="number"
                  min="1"
                  max={teamSizeRange[1]}
                  value={teamSizeRange[0]}
                  onChange={(e) => handleTeamSizeChange(e, 0)}
                  className="w-16 focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
                <span className="text-gray-500 dark:text-gray-400">to</span>
                <input
                  type="number"
                  min={teamSizeRange[0]}
                  value={teamSizeRange[1]}
                  onChange={(e) => handleTeamSizeChange(e, 1)}
                  className="w-16 focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
                <span className="text-gray-500 dark:text-gray-400">members</span>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                Date Range
              </h3>
              <div className="flex items-center space-x-4">
                <input
                  type="date"
                  value={dateRange[0]}
                  onChange={(e) => handleDateChange(e, 0)}
                  className="focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
                <span className="text-gray-500 dark:text-gray-400">to</span>
                <input
                  type="date"
                  value={dateRange[1]}
                  onChange={(e) => handleDateChange(e, 1)}
                  className="focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                <Globe className="h-4 w-4 mr-1 text-gray-500" />
                Event Format
              </h3>
              <div className="space-y-2">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={isOnlineOnly}
                    onChange={() => setIsOnlineOnly(!isOnlineOnly)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-700 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Online Events Only</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={isUpcomingOnly}
                    onChange={() => setIsUpcomingOnly(!isUpcomingOnly)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-700 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Upcoming Events Only</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
          {filteredHackathons.length} hackathons found
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHackathons.map((hackathon) => (
          <HackathonCard key={hackathon.id} hackathon={hackathon} />
        ))}
        
        {filteredHackathons.length === 0 && (
          <div className="col-span-3 text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No hackathons found</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Try adjusting your filters or check back later for new events.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HackathonsPage;