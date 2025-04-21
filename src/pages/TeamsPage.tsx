import React, { useState, useEffect } from 'react';
import { Plus, Users, Search, Filter, Sparkles, CalendarDays, X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useDataStore } from '../store/dataStore';
import TeamCard from '../components/TeamCard';
import { Link, useNavigate } from 'react-router-dom';
import CreateTeamModal from '../components/ui/CreateTeamModal';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const TeamsPage: React.FC = () => {
  const { user } = useAuthStore();
  const { teams, users, hackathons, fetchTeams, fetchHackathons, loading } = useDataStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [hackathonFilter, setHackathonFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchTeams();
    fetchHackathons();
  }, [fetchTeams, fetchHackathons]);
  
  // Get all unique roles from all teams
  const allRoles = Array.from(
    new Set(teams.flatMap(team => team.lookingForRoles))
  );
  
  // Filter teams based on search and filters
  const filteredTeams = teams.filter(team => {
    // Filter by search term
    if (searchTerm && !team.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !team.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !team.lookingForRoles.some(role => role.toLowerCase().includes(searchTerm.toLowerCase()))) {
      return false;
    }
    
    // Filter by hackathon
    if (hackathonFilter && team.hackathonId !== hackathonFilter) {
      return false;
    }
    
    // Filter by role
    if (roleFilter && !team.lookingForRoles.includes(roleFilter)) {
      return false;
    }
    
    return true;
  });
  
  // Get members for each team
  const getTeamMembers = (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    if (!team) return [];
    
    return team.members
      .map(memberId => users.find(user => user.id === memberId))
      .filter(Boolean) as any[];
  };
  
  // Get hackathon for a team
  const getTeamHackathon = (hackathonId: string) => {
    return hackathons.find(h => h.id === hackathonId);
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setHackathonFilter('');
    setRoleFilter('');
  };
  
  const handleJoinTeam = (teamId: string) => {
    if (!user) {
      toast.error('You need to be logged in to join a team');
      navigate('/login');
      return;
    }
    
    // In a real app, this would open a modal or navigate to a page to request to join the team
    toast.success('Team join request submitted');
  };
  
  if (loading.teams || loading.hackathons) {
    return <LoadingSpinner message="Loading teams..." />;
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
          Find or Create a Team
        </h1>
        <p className="mt-3 text-xl text-gray-500 dark:text-gray-400 sm:mt-4">
          Join an existing team or start your own for upcoming hackathons.
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 py-2 sm:text-sm border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            placeholder="Search teams..."
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-2 py-1 border border-transparent rounded-md text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
            >
              <Filter className="h-4 w-4 mr-1" />
              Filters
            </button>
          </div>
        </div>
        
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
        >
          <Plus className="h-4 w-4 mr-1" />
          Create Team
        </button>
      </div>
      
      {showFilters && (
        <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Filters</h3>
            <button 
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              onClick={clearFilters}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="hackathonFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <div className="flex items-center">
                  <CalendarDays className="h-4 w-4 mr-1" />
                  Hackathon
                </div>
              </label>
              <select
                id="hackathonFilter"
                value={hackathonFilter}
                onChange={(e) => setHackathonFilter(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <option value="">All Hackathons</option>
                {hackathons.map(hackathon => (
                  <option key={hackathon.id} value={hackathon.id}>
                    {hackathon.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="roleFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  Role Needed
                </div>
              </label>
              <select
                id="roleFilter"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <option value="">All Roles</option>
                {allRoles.map(role => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-yellow-500" />
          Teams Looking for Members
        </h2>
        
        {filteredTeams.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No teams found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {searchTerm || hackathonFilter || roleFilter
                ? "There are no teams matching your search criteria."
                : "There are no teams looking for members yet."}
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
            >
              <Plus className="h-4 w-4 mr-1" />
              Create a New Team
            </button>
          </div>
        ) : (
          <div>
            {/* Teams with openings first */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {filteredTeams
                .filter(team => team.lookingForRoles.length > 0)
                .map(team => (
                  <TeamCard 
                    key={team.id} 
                    team={team} 
                    members={getTeamMembers(team.id)}
                    hackathon={getTeamHackathon(team.hackathonId)}
                    onJoin={() => handleJoinTeam(team.id)}
                  />
                ))}
            </div>
            
            {/* Complete teams section */}
            {filteredTeams.some(team => team.lookingForRoles.length === 0) && (
              <>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                  <Users className="h-5 w-5 mr-2 text-primary-500" />
                  Complete Teams
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTeams
                    .filter(team => team.lookingForRoles.length === 0)
                    .map(team => (
                      <TeamCard 
                        key={team.id} 
                        team={team} 
                        members={getTeamMembers(team.id)}
                        hackathon={getTeamHackathon(team.hackathonId)}
                      />
                    ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
      
      {/* Create Team Modal */}
      <CreateTeamModal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)}
        onSuccess={(teamId) => {
          // In a real app, you might navigate to the team's page
          toast.success('Team created successfully!');
        }}
      />
    </div>
  );
};

export default TeamsPage;