import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, Bell, Award, Settings, User, Clock, MessageSquare, Zap, Shield, Trophy, Code } from 'lucide-react';
import { useAppStore } from '../store';
import HackathonCard from '../components/HackathonCard';
import UserCard from '../components/UserCard';

const DashboardPage: React.FC = () => {
  const { currentUser, hackathons, users, teamRequests } = useAppStore();
  const [activeTab, setActiveTab] = useState('overview');
  
  if (!currentUser) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Please log in</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">You need to be logged in to view your dashboard.</p>
          <div className="mt-6">
            <Link
              to="/login"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 dark:bg-primary-500 hover:bg-primary-700 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Upcoming hackathons - filter to show only those in the future
  const upcomingHackathons = hackathons
    .filter(hackathon => new Date(hackathon.startDate) > new Date())
    .slice(0, 3);

  // Recommended teammates - just show a few random users for demo
  const recommendedTeammates = users
    .filter(user => user.id !== currentUser.id)
    .slice(0, 3);

  // Pending team requests - in a real app, this would filter based on the current user
  const pendingRequests = teamRequests.filter(request => 
    request.receiverId === currentUser.id && request.status === 'pending'
  );
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-300 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="w-full md:w-64 mb-8 md:mb-0">
            <nav className="space-y-1 bg-white dark:bg-dark-100 shadow-md dark:shadow-xl rounded-lg overflow-hidden transition-colors duration-200">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                  activeTab === 'overview'
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border-l-4 border-primary-500 dark:border-primary-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-200 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Calendar className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
                <span className="truncate">Overview</span>
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                  activeTab === 'profile'
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border-l-4 border-primary-500 dark:border-primary-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-200 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <User className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
                <span className="truncate">My Profile</span>
              </button>

              <button
                onClick={() => setActiveTab('hackathons')}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                  activeTab === 'hackathons'
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border-l-4 border-primary-500 dark:border-primary-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-200 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Award className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
                <span className="truncate">My Hackathons</span>
              </button>

              <button
                onClick={() => setActiveTab('teams')}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                  activeTab === 'teams'
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border-l-4 border-primary-500 dark:border-primary-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-200 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Users className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
                <span className="truncate">My Teams</span>
              </button>

              <button
                onClick={() => setActiveTab('messages')}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                  activeTab === 'messages'
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border-l-4 border-primary-500 dark:border-primary-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-200 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <MessageSquare className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
                <span className="truncate">Messages</span>
                {pendingRequests.length > 0 && (
                  <span className="ml-auto inline-block py-0.5 px-2 text-xs font-medium rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-800 dark:text-primary-300">
                    {pendingRequests.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('achievements')}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                  activeTab === 'achievements'
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border-l-4 border-primary-500 dark:border-primary-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-200 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Trophy className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
                <span className="truncate">Achievements</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                  activeTab === 'settings'
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border-l-4 border-primary-500 dark:border-primary-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-200 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Settings className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
                <span className="truncate">Settings</span>
              </button>
            </nav>
          </div>

          {/* Main content */}
          <div className="md:ml-8 flex-1">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-dark-100 shadow-md dark:shadow-xl rounded-lg overflow-hidden border border-gray-100 dark:border-gray-800 transition-colors duration-200">
                  <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-800">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Welcome back, {currentUser.name}</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Here's what's happening with your hackathon teams.
                    </p>
                  </div>
                  <div className="px-4 py-5 sm:p-6">
                    <h4 className="text-base font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                      <Calendar className="h-5 w-5 text-primary-500 dark:text-primary-400 mr-2" />
                      Your upcoming hackathons
                    </h4>
                    {upcomingHackathons.length > 0 ? (
                      <div className="space-y-4">
                        {upcomingHackathons.map((hackathon) => (
                          <div key={hackathon.id} className="flex items-center p-4 bg-gray-50 dark:bg-dark-200 rounded-lg border border-gray-100 dark:border-gray-800 transition-colors duration-200">
                            <Calendar className="h-10 w-10 text-primary-500 dark:text-primary-400" />
                            <div className="ml-4">
                              <h5 className="text-sm font-medium text-gray-900 dark:text-white">{hackathon.name}</h5>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(hackathon.startDate).toLocaleDateString()} - {new Date(hackathon.endDate).toLocaleDateString()}
                              </p>
                            </div>
                            <Link
                              to={`/hackathons`}
                              className="ml-auto text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 text-sm font-medium transition-colors duration-200"
                            >
                              View Details
                            </Link>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <Clock className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">No upcoming hackathons</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Explore upcoming hackathons and register your team.
                        </p>
                        <div className="mt-4">
                          <Link
                            to="/hackathons"
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-primary-600 dark:bg-primary-500 hover:bg-primary-700 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                          >
                            Browse Hackathons
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white dark:bg-dark-100 shadow-md dark:shadow-xl rounded-lg overflow-hidden border border-gray-100 dark:border-gray-800 transition-colors duration-200">
                  <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200 dark:border-gray-800">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                      <Bell className="h-5 w-5 text-primary-500 dark:text-primary-400 mr-2" />
                      Team Requests
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300">
                      {pendingRequests.length} New
                    </span>
                  </div>
                  <div className="px-4 py-5 sm:p-6">
                    {pendingRequests.length > 0 ? (
                      <div className="space-y-4">
                        {pendingRequests.map((request) => {
                          const sender = users.find(user => user.id === request.senderId);
                          return sender ? (
                            <div key={request.id} className="flex items-center p-4 bg-gray-50 dark:bg-dark-200 rounded-lg border border-gray-100 dark:border-gray-800 transition-colors duration-200">
                              <img
                                src={sender.avatar}
                                alt={sender.name}
                                className="h-10 w-10 rounded-full border border-gray-200 dark:border-gray-700"
                              />
                              <div className="ml-4">
                                <h5 className="text-sm font-medium text-gray-900 dark:text-white">{sender.name}</h5>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  Wants to join your team for a hackathon
                                </p>
                              </div>
                              <div className="ml-auto space-x-2">
                                <button className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-primary-600 dark:bg-primary-500 hover:bg-primary-700 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200">
                                  Accept
                                </button>
                                <button className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 dark:border-gray-700 text-xs font-medium rounded text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-200 hover:bg-gray-50 dark:hover:bg-dark-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200">
                                  Decline
                                </button>
                              </div>
                            </div>
                          ) : null;
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <Bell className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">No pending requests</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          You'll be notified when someone wants to join your team.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white dark:bg-dark-100 shadow-md dark:shadow-xl rounded-lg overflow-hidden border border-gray-100 dark:border-gray-800 transition-colors duration-200">
                  <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-800">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                      <Zap className="h-5 w-5 text-primary-500 dark:text-primary-400 mr-2" />
                      Recommended Teammates
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Developers who might be a good fit for your next hackathon.
                    </p>
                  </div>
                  <div className="px-4 py-5 sm:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {recommendedTeammates.map((user) => (
                        <UserCard key={user.id} user={user} onConnect={() => {}} />
                      ))}
                    </div>
                    <div className="mt-6 text-center">
                      <Link
                        to="/search"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 dark:bg-primary-500 hover:bg-primary-700 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                      >
                        Find More Teammates
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="bg-white dark:bg-dark-100 shadow-md dark:shadow-xl rounded-lg overflow-hidden border border-gray-100 dark:border-gray-800 transition-colors duration-200">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-800">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Your Profile</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Manage your personal information and how others see you.
                  </p>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <Link
                    to={`/profile/${currentUser.id}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 dark:bg-primary-500 hover:bg-primary-700 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                  >
                    View Public Profile
                  </Link>
                </div>
              </div>
            )}

            {activeTab === 'hackathons' && (
              <div className="bg-white dark:bg-dark-100 shadow-md dark:shadow-xl rounded-lg overflow-hidden border border-gray-100 dark:border-gray-800 transition-colors duration-200">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-800">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Your Hackathons</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Manage the hackathons you're registered for.
                  </p>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {upcomingHackathons.slice(0, 2).map((hackathon) => (
                      <HackathonCard key={hackathon.id} hackathon={hackathon} />
                    ))}
                  </div>
                  {upcomingHackathons.length === 0 && (
                    <div className="text-center py-4">
                      <Calendar className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">No hackathons registered</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Browse and register for upcoming hackathons.
                      </p>
                      <div className="mt-4">
                        <Link
                          to="/hackathons"
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-primary-600 dark:bg-primary-500 hover:bg-primary-700 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                        >
                          Browse Hackathons
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'teams' && (
              <div className="bg-white dark:bg-dark-100 shadow-md dark:shadow-xl rounded-lg overflow-hidden border border-gray-100 dark:border-gray-800 transition-colors duration-200">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-800">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Your Teams</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Manage your hackathon teams and members.
                  </p>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <div className="text-center py-4">
                    <Users className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">No teams yet</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Start by creating a team or joining an existing one.
                    </p>
                    <div className="mt-4">
                      <button
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-primary-600 dark:bg-primary-500 hover:bg-primary-700 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                      >
                        Create a Team
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'messages' && (
              <div className="bg-white dark:bg-dark-100 shadow-md dark:shadow-xl rounded-lg overflow-hidden border border-gray-100 dark:border-gray-800 transition-colors duration-200">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-800">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Messages</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Communicate with your teammates and other developers.
                  </p>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <div className="text-center py-4">
                    <MessageSquare className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">No messages yet</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Start a conversation with another developer.
                    </p>
                    <div className="mt-4">
                      <Link
                        to="/search"
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-primary-600 dark:bg-primary-500 hover:bg-primary-700 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                      >
                        Find Developers
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'achievements' && (
              <div className="bg-white dark:bg-dark-100 shadow-md dark:shadow-xl rounded-lg overflow-hidden border border-gray-100 dark:border-gray-800 transition-colors duration-200">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-800">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Your Achievements</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Track your progress and accomplishments in the community.
                  </p>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 dark:bg-dark-200 p-4 rounded-lg border border-gray-100 dark:border-gray-800 shadow-sm">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-300 mx-auto mb-3">
                        <Trophy className="h-6 w-6" />
                      </div>
                      <h4 className="text-center text-sm font-medium text-gray-900 dark:text-white mb-1">First Hackathon</h4>
                      <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                        Participated in your first hackathon event
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-dark-200 p-4 rounded-lg border border-gray-100 dark:border-gray-800 shadow-sm opacity-50">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 mx-auto mb-3">
                        <Code className="h-6 w-6" />
                      </div>
                      <h4 className="text-center text-sm font-medium text-gray-900 dark:text-white mb-1">Code Master</h4>
                      <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                        Complete 5 hackathon projects (2/5)
                      </p>
                      <div className="mt-2 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                        <div className="bg-blue-600 dark:bg-blue-500 h-1.5 rounded-full" style={{ width: '40%' }}></div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-dark-200 p-4 rounded-lg border border-gray-100 dark:border-gray-800 shadow-sm opacity-50">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300 mx-auto mb-3">
                        <Shield className="h-6 w-6" />
                      </div>
                      <h4 className="text-center text-sm font-medium text-gray-900 dark:text-white mb-1">Team Leader</h4>
                      <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                        Successfully lead a team in a hackathon
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white dark:bg-dark-100 shadow-md dark:shadow-xl rounded-lg overflow-hidden border border-gray-100 dark:border-gray-800 transition-colors duration-200">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-800">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Account Settings</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Manage your account preferences and settings.
                  </p>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Account settings will be implemented in a future update.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;