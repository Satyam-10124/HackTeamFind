import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Award, Calendar, Search, Code, Star, MapPin, Zap, Globe, Shield } from 'lucide-react';
import { useAppStore } from '../store';

const LandingPage: React.FC = () => {
  const { hackathons, users, darkMode } = useAppStore();
  
  // Display only upcoming hackathons
  const upcomingHackathons = hackathons
    .filter(hackathon => new Date(hackathon.startDate) > new Date())
    .slice(0, 3);

  return (
    <div className="bg-white dark:bg-dark-300 transition-colors duration-200">
      {/* Hero section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white dark:from-dark-300 dark:to-dark-200">
        <div className="absolute inset-0 dark:bg-grid-white/[0.05] bg-grid-black/[0.02] -z-10"></div>
        <div className="max-w-7xl mx-auto relative">
          <div className="relative z-10 pb-8 bg-transparent sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <svg
              className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white dark:text-dark-200 transform translate-x-1/2"
              fill="currentColor"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <polygon points="50,0 100,0 50,100 0,100" />
            </svg>

            <div className="relative pt-6 px-4 sm:px-6 lg:px-8"></div>

            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Find Your Perfect</span>{' '}
                  <span className="block gradient-text">Hackathon Team</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 dark:text-gray-400 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Connect with like-minded Web3 developers to accelerate innovation. Build your dream team for your next hackathon and create something amazing together.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link
                      to="/signup"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 md:py-4 md:text-lg md:px-10 transition-colors duration-200"
                    >
                      Join Now
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link
                      to="/hackathons"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 dark:text-primary-300 bg-primary-100 dark:bg-primary-900/30 hover:bg-primary-200 dark:hover:bg-primary-800/40 md:py-4 md:text-lg md:px-10 transition-colors duration-200"
                    >
                      Explore Hackathons
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80"
            alt="Team working together"
          />
          {darkMode && <div className="absolute inset-0 bg-gradient-to-r from-dark-300 to-transparent lg:hidden"></div>}
        </div>
      </div>

      {/* How it works section */}
      <div className="py-12 bg-gray-50 dark:bg-dark-200 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary-600 dark:text-primary-400 font-semibold tracking-wide uppercase">How It Works</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Find your perfect team in three easy steps
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 lg:mx-auto">
              Our platform makes it simple to connect with the right teammates for your next Web3 hackathon.
            </p>
          </div>

          <div className="mt-10">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 dark:bg-primary-600 text-white">
                    <Users className="h-6 w-6" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white">Create Your Profile</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500 dark:text-gray-400">
                  Showcase your skills, experience, and preferred roles. Link your GitHub profile to verify your contributions.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 dark:bg-primary-600 text-white">
                    <Search className="h-6 w-6" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white">Find Teammates</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500 dark:text-gray-400">
                  Browse developer profiles filtered by skills, experience, and availability. Our matching algorithm suggests perfect team members.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 dark:bg-primary-600 text-white">
                    <Award className="h-6 w-6" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white">Join Hackathons</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500 dark:text-gray-400">
                  Register for upcoming hackathons with your newly formed team and collaborate to build innovative projects.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Upcoming hackathons section */}
      <div className="py-12 bg-white dark:bg-dark-300 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-10">
            <h2 className="text-base text-primary-600 dark:text-primary-400 font-semibold tracking-wide uppercase">Upcoming Hackathons</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Join these exciting events
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingHackathons.map((hackathon) => (
              <div key={hackathon.id} className="bg-white dark:bg-dark-100 overflow-hidden shadow-md dark:shadow-xl rounded-lg border border-gray-100 dark:border-gray-800 hover:shadow-lg dark:hover:shadow-primary-900/20 transition-all duration-300 card-hover">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <img
                      src={hackathon.organizerLogo}
                      alt={hackathon.organizer}
                      className="h-10 w-10 rounded-full border border-gray-200 dark:border-gray-700"
                    />
                    <div className="ml-4">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{hackathon.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Organized by {hackathon.organizer}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
                      <p>
                        {new Date(hackathon.startDate).toLocaleDateString()} - {new Date(hackathon.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                      <MapPin className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
                      <p>{hackathon.location}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Link
                      to="/hackathons"
                      className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 transition-colors duration-200"
                    >
                      Learn more <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/hackathons"
              className="inline-flex items-center px-5 py-2 border border-transparent text-base font-medium rounded-md text-primary-700 dark:text-primary-300 bg-primary-100 dark:bg-primary-900/30 hover:bg-primary-200 dark:hover:bg-primary-800/40 transition-colors duration-200"
            >
              View All Hackathons <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="py-12 bg-gray-50 dark:bg-dark-200 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary-600 dark:text-primary-400 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Everything you need to build the perfect team
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="relative p-6 bg-white dark:bg-dark-100 rounded-xl shadow-md dark:shadow-xl border border-gray-100 dark:border-gray-800 transition-all duration-300 card-hover">
                <dt className="flex items-center">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 dark:bg-primary-600 text-white mr-4">
                    <Zap className="h-6 w-6" />
                  </div>
                  <p className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Smart Matching Algorithm</p>
                </dt>
                <dd className="mt-2 text-base text-gray-500 dark:text-gray-400">
                  Our intelligent algorithm suggests team members based on complementary skills, shared interests, and hackathon goals.
                </dd>
              </div>

              <div className="relative p-6 bg-white dark:bg-dark-100 rounded-xl shadow-md dark:shadow-xl border border-gray-100 dark:border-gray-800 transition-all duration-300 card-hover">
                <dt className="flex items-center">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 dark:bg-primary-600 text-white mr-4">
                    <Code className="h-6 w-6" />
                  </div>
                  <p className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Skill Verification</p>
                </dt>
                <dd className="mt-2 text-base text-gray-500 dark:text-gray-400">
                  Connect your GitHub and verify your blockchain experience by linking your wallet to showcase your contributions.
                </dd>
              </div>

              <div className="relative p-6 bg-white dark:bg-dark-100 rounded-xl shadow-md dark:shadow-xl border border-gray-100 dark:border-gray-800 transition-all duration-300 card-hover">
                <dt className="flex items-center">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 dark:bg-primary-600 text-white mr-4">
                    <Globe className="h-6 w-6" />
                  </div>
                  <p className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Hackathon Directory</p>
                </dt>
                <dd className="mt-2 text-base text-gray-500 dark:text-gray-400">
                  Browse and filter upcoming Web3 hackathons by date, location, prizes, and technologies.
                </dd>
              </div>

              <div className="relative p-6 bg-white dark:bg-dark-100 rounded-xl shadow-md dark:shadow-xl border border-gray-100 dark:border-gray-800 transition-all duration-300 card-hover">
                <dt className="flex items-center">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 dark:bg-primary-600 text-white mr-4">
                    <Shield className="h-6 w-6" />
                  </div>
                  <p className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Team Reputation System</p>
                </dt>
                <dd className="mt-2 text-base text-gray-500 dark:text-gray-400">
                  Build your reputation through peer reviews after hackathons, showcasing your reliability and skills.
                </dd>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-gradient-to-r from-primary-700 to-primary-900 dark:from-primary-800 dark:to-primary-900">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to find your dream team?</span>
            <span className="block text-primary-200 dark:text-primary-300">Join our platform today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 dark:text-primary-900 bg-white hover:bg-primary-50 dark:hover:bg-gray-100 transition-colors duration-200"
              >
                Get Started
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link
                to="/search"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-500 dark:bg-primary-500 dark:hover:bg-primary-400 transition-colors duration-200"
              >
                Find Teammates
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;