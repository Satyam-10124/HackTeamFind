import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, Users, Plus, Calendar, Target, Info } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useDataStore } from '../../store/dataStore';
import toast from 'react-hot-toast';

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (teamId: string) => void;
}

interface CreateTeamFormValues {
  name: string;
  description: string;
  hackathonId: string;
  lookingForRoles: string[];
}

const roleOptions = [
  'Frontend Developer',
  'Backend Developer',
  'Smart Contract Developer',
  'UI/UX Designer',
  'Project Manager',
  'Blockchain Developer',
  'DevOps Engineer',
  'Data Scientist',
  'Technical Writer',
];

const CreateTeamModal: React.FC<CreateTeamModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuthStore();
  const { hackathons, createTeam, loading } = useDataStore();
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateTeamFormValues>();
  
  const onSubmit = async (data: CreateTeamFormValues) => {
    if (!user) {
      toast.error('You must be logged in to create a team');
      return;
    }
    
    if (selectedRoles.length === 0) {
      toast.error('Please select at least one role you are looking for');
      return;
    }
    
    try {
      const teamId = await createTeam({
        name: data.name,
        description: data.description,
        hackathonId: data.hackathonId,
        lookingForRoles: selectedRoles,
        members: [user.id],
        leader: user.id,
      });
      
      if (teamId) {
        toast.success('Team created successfully!');
        reset();
        setSelectedRoles([]);
        if (onSuccess) onSuccess(teamId);
        onClose();
      }
    } catch (error) {
      toast.error('Failed to create team');
    }
  };
  
  const toggleRole = (role: string) => {
    if (selectedRoles.includes(role)) {
      setSelectedRoles(selectedRoles.filter(r => r !== role));
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 overflow-y-auto z-50">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
        </div>
        
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900 sm:mx-0 sm:h-10 sm:w-10">
                <Users className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                    Create New Team
                  </h3>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <div className="mt-4">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-5">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Team Name*
                        </label>
                        <input
                          type="text"
                          id="name"
                          className={`mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                            errors.name ? 'border-red-300 dark:border-red-700' : ''
                          }`}
                          {...register("name", { required: "Team name is required" })}
                        />
                        {errors.name && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Team Description*
                        </label>
                        <textarea
                          id="description"
                          rows={3}
                          className={`mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                            errors.description ? 'border-red-300 dark:border-red-700' : ''
                          }`}
                          placeholder="Describe your team, project idea, and what you're looking for in teammates"
                          {...register("description", { required: "Team description is required" })}
                        ></textarea>
                        {errors.description && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="hackathonId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            Hackathon*
                          </div>
                        </label>
                        <select
                          id="hackathonId"
                          className={`mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                            errors.hackathonId ? 'border-red-300 dark:border-red-700' : ''
                          }`}
                          {...register("hackathonId", { required: "Please select a hackathon" })}
                        >
                          <option value="">Select a hackathon</option>
                          {hackathons
                            .filter(h => new Date(h.startDate) > new Date()) // Only show upcoming hackathons
                            .map(hackathon => (
                              <option key={hackathon.id} value={hackathon.id}>
                                {hackathon.name} ({new Date(hackathon.startDate).toLocaleDateString()})
                              </option>
                            ))}
                        </select>
                        {errors.hackathonId && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.hackathonId.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          <div className="flex items-center">
                            <Target className="h-4 w-4 mr-1" />
                            Roles Needed*
                          </div>
                        </label>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                          Select the roles you're looking for in teammates
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {roleOptions.map(role => (
                            <button
                              key={role}
                              type="button"
                              onClick={() => toggleRole(role)}
                              className={`inline-flex items-center px-2.5 py-1.5 border text-xs font-medium rounded ${
                                selectedRoles.includes(role)
                                  ? 'border-primary-500 dark:border-primary-400 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300'
                                  : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                              } transition-colors duration-200`}
                            >
                              {role}
                            </button>
                          ))}
                          
                          {selectedRoles.length === 0 && (
                            <p className="text-xs text-red-600 dark:text-red-400 my-1">
                              Please select at least one role
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <Info className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-yellow-700 dark:text-yellow-300">
                              You will be automatically set as the team leader. You can invite others to join after creating the team.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                      <button
                        type="submit"
                        disabled={loading.teams || selectedRoles.length === 0}
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 dark:bg-primary-500 text-base font-medium text-white hover:bg-primary-700 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {loading.teams ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Creating...
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4 mr-1" />
                            Create Team
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:w-auto sm:text-sm transition-colors duration-200"
                        onClick={onClose}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTeamModal;