import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { MapPin, Mail, Briefcase, Calendar, Globe, Zap } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useDataStore } from '../../store/dataStore';
import toast from 'react-hot-toast';
import SkillBadge from '../SkillBadge';
import { skills } from '../../data/mockData';
import { Skill } from '../../types';

interface ProfileFormProps {
  onSuccess?: () => void;
}

interface ProfileFormValues {
  name: string;
  bio: string;
  location: string;
  githubUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  preferredCommunication: string;
  eventType: 'online' | 'offline' | 'hybrid';
  timezone: string;
  teamRoles: string[];
  availability: string[];
}

const ProfileForm: React.FC<ProfileFormProps> = ({ onSuccess }) => {
  const { user, updateProfile, loading } = useAuthStore();
  const { fetchUserById } = useDataStore();
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
  
  // Group skills by category for better organization
  const skillsByCategory = skills.reduce((acc, skill) => {
    const category = skill.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);
  
  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormValues>({
    defaultValues: {
      name: user?.user_metadata?.name || '',
      bio: '',
      location: '',
      githubUrl: '',
      linkedinUrl: '',
      twitterUrl: '',
      preferredCommunication: 'Email',
      eventType: 'hybrid',
      timezone: 'GMT',
      teamRoles: ['Developer'],
      availability: ['Weekends'],
    }
  });
  
  const toggleSkill = (skill: Skill) => {
    if (selectedSkills.some(s => s.id === skill.id)) {
      setSelectedSkills(selectedSkills.filter(s => s.id !== skill.id));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };
  
  const onSubmit = async (data: ProfileFormValues) => {
    try {
      await updateProfile({
        name: data.name,
      });
      
      // Here we would update the extended profile information
      // In a real application, this would update the profiles table and related tables
      
      toast.success('Profile updated successfully');
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };
  
  return (
    <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
            Basic Information
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            Your personal details shown to other developers
          </p>
        </div>
        
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  type="text"
                  className={`shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-800 dark:text-white ${
                    errors.name ? 'border-red-300 dark:border-red-700' : ''
                  }`}
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
                )}
              </div>
            </div>
            
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" />
                  Location
                </div>
              </label>
              <div className="mt-1">
                <input
                  id="location"
                  type="text"
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-800 dark:text-white"
                  placeholder="City, Country"
                  {...register("location")}
                />
              </div>
            </div>
            
            <div className="sm:col-span-2">
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Bio
              </label>
              <div className="mt-1">
                <textarea
                  id="bio"
                  rows={3}
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-800 dark:text-white"
                  placeholder="Tell others about yourself and your experience in Web3 development"
                  {...register("bio")}
                ></textarea>
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Brief description for your profile. This will be displayed on your public profile.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
            Social Profiles
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            Connect your professional accounts
          </p>
        </div>
        
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                GitHub Profile
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 sm:text-sm">
                  github.com/
                </span>
                <input
                  type="text"
                  id="githubUrl"
                  className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  placeholder="username"
                  {...register("githubUrl")}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="linkedinUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                LinkedIn Profile
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 sm:text-sm">
                  linkedin.com/in/
                </span>
                <input
                  type="text"
                  id="linkedinUrl"
                  className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  placeholder="username"
                  {...register("linkedinUrl")}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="twitterUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Twitter Profile
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 sm:text-sm">
                  twitter.com/
                </span>
                <input
                  type="text"
                  id="twitterUrl"
                  className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  placeholder="username"
                  {...register("twitterUrl")}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="preferredCommunication" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" />
                  Preferred Communication
                </div>
              </label>
              <select
                id="preferredCommunication"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-800 dark:text-white"
                {...register("preferredCommunication")}
              >
                <option value="Email">Email</option>
                <option value="Discord">Discord</option>
                <option value="Slack">Slack</option>
                <option value="Telegram">Telegram</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
            <div className="flex items-center">
              <Zap className="h-5 w-5 mr-2 text-primary-500 dark:text-primary-400" />
              Skills & Expertise
            </div>
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            Select the technologies you're proficient in
          </p>
        </div>
        
        <div className="px-4 py-5 sm:p-6">
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
      </div>
      
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
            Hackathon Preferences
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            Set your preferences for hackathon participation
          </p>
        </div>
        
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" />
                  Event Type Preference
                </div>
              </label>
              <select
                id="eventType"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-800 dark:text-white"
                {...register("eventType")}
              >
                <option value="hybrid">Hybrid (Online or In-Person)</option>
                <option value="online">Online Only</option>
                <option value="offline">In-Person Only</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" />
                  Timezone
                </div>
              </label>
              <select
                id="timezone"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-800 dark:text-white"
                {...register("timezone")}
              >
                <option value="GMT">GMT (Greenwich Mean Time)</option>
                <option value="EST">EST (Eastern Standard Time)</option>
                <option value="CST">CST (Central Standard Time)</option>
                <option value="PST">PST (Pacific Standard Time)</option>
                <option value="IST">IST (Indian Standard Time)</option>
                <option value="JST">JST (Japan Standard Time)</option>
              </select>
            </div>
            
            <div>
              <fieldset>
                <legend className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  <div className="flex items-center">
                    <Briefcase className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" />
                    Preferred Team Roles
                  </div>
                </legend>
                <div className="mt-4 space-y-2">
                  {['Frontend Developer', 'Backend Developer', 'Smart Contract Developer', 'Designer', 'Project Manager'].map((role) => (
                    <div key={role} className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id={`role-${role}`}
                          type="checkbox"
                          value={role}
                          className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 dark:border-gray-700 rounded dark:bg-gray-800"
                          {...register("teamRoles")}
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor={`role-${role}`} className="font-medium text-gray-700 dark:text-gray-300">
                          {role}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </fieldset>
            </div>
            
            <div>
              <fieldset>
                <legend className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" />
                    Availability
                  </div>
                </legend>
                <div className="mt-4 space-y-2">
                  {['Weekdays', 'Weekends', 'Evenings', 'Mornings'].map((time) => (
                    <div key={time} className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id={`time-${time}`}
                          type="checkbox"
                          value={time}
                          className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 dark:border-gray-700 rounded dark:bg-gray-800"
                          {...register("availability")}
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor={`time-${time}`} className="font-medium text-gray-700 dark:text-gray-300">
                          {time}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </fieldset>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          type="button"
          className="bg-white dark:bg-gray-800 py-2 px-4 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200 mr-3"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;