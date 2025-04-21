import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Github, Twitter, Linkedin, ExternalLink, Code, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-dark-300 border-t border-gray-200 dark:border-gray-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <div className="flex items-center">
              <Calendar className="h-10 w-10 text-primary-600 dark:text-primary-400" />
              <span className="ml-3 text-2xl font-bold text-primary-800 dark:text-primary-300">HackTeamFinder</span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-base">
              Finding the perfect teammates for your next Web3 hackathon has never been easier.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-300 transition-colors duration-200">
                <span className="sr-only">GitHub</span>
                <Github className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-300 transition-colors duration-200">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-300 transition-colors duration-200">
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-300 tracking-wider uppercase">
                  Features
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link to="/search" className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">
                      Find Teammates
                    </Link>
                  </li>
                  <li>
                    <Link to="/hackathons" className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">
                      Hackathon Listings
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">
                      Team Matching
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">
                      Skill Verification
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-300 tracking-wider uppercase">
                  Support
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link to="#" className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">
                      Help Center
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">
                      Community Guidelines
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-300 tracking-wider uppercase">
                  Company
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link to="#" className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">
                      Partners
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">
                      Careers
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-300 tracking-wider uppercase">
                  Legal
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link to="#" className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">
                      Cookie Policy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 dark:border-gray-800 pt-8">
          <p className="text-base text-gray-400 dark:text-gray-500 xl:text-center">
            &copy; 2025 HackTeamFinder. All rights reserved.
          </p>
          <div className="mt-4 text-sm text-gray-400 dark:text-gray-500 flex items-center justify-center">
            <span className="flex items-center">
              Made with <Heart className="h-4 w-4 text-accent-500 mx-1" /> and <Code className="h-4 w-4 text-primary-500 mx-1" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;