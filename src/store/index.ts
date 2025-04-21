import { create } from 'zustand';
import { User, Hackathon, TeamRequest, Team, Message, Notification } from '../types';
import { mockUsers, mockHackathons } from '../data/mockData';

interface AppState {
  users: User[];
  hackathons: Hackathon[];
  currentUser: User | null;
  teamRequests: TeamRequest[];
  filteredUsers: User[];
  teams: Team[];
  messages: Message[];
  notifications: Notification[];
  darkMode: boolean;
  
  // Actions
  setCurrentUser: (user: User | null) => void;
  sendTeamRequest: (request: Omit<TeamRequest, 'id' | 'createdAt'>) => void;
  updateTeamRequestStatus: (id: string, status: 'accepted' | 'rejected') => void;
  filterUsers: (filters: {
    skills?: string[];
    location?: string;
    eventType?: 'online' | 'offline' | 'hybrid';
    availability?: string[];
    experience?: string[];
    lookingForTeam?: boolean;
    hackathonInterest?: string;
  }) => void;
  createTeam: (team: Omit<Team, 'id' | 'createdAt'>) => string;
  joinTeam: (teamId: string, userId: string) => void;
  leaveTeam: (teamId: string, userId: string) => void;
  sendMessage: (message: Omit<Message, 'id' | 'createdAt' | 'read'>) => void;
  markMessageAsRead: (messageId: string) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markNotificationAsRead: (notificationId: string) => void;
  toggleDarkMode: () => void;
  calculateMatchScore: (userId: string, otherUserId: string) => number;
}

// Calculate compatibility score between two users
const calculateCompatibility = (user1: User, user2: User): number => {
  let score = 0;
  const maxScore = 100;
  
  // Skill complementarity (different skills increase score)
  const user1Skills = new Set(user1.skills.map(s => s.name));
  const user2Skills = new Set(user2.skills.map(s => s.name));
  const differentSkills = [...user2Skills].filter(s => !user1Skills.has(s));
  score += (differentSkills.length / user2Skills.size) * 30; // 30% weight for complementary skills
  
  // Location preference match
  if (user1.preferences.eventType === user2.preferences.eventType) {
    score += 15; // 15% weight for matching event type preference
  }
  
  // Timezone compatibility
  if (user1.preferences.timezone === user2.preferences.timezone) {
    score += 15; // 15% weight for same timezone
  }
  
  // Availability match
  const availability1 = new Set(user1.preferences.availability);
  const availability2 = new Set(user2.preferences.availability);
  const matchingAvailability = [...availability2].filter(a => availability1.has(a));
  score += (matchingAvailability.length / availability2.size) * 20; // 20% weight for matching availability
  
  // Same hackathon interests (to be expanded with real data)
  score += 20; // Placeholder: 20% weight for potential hackathon interest alignment
  
  return Math.min(Math.round(score), maxScore);
};

export const useAppStore = create<AppState>((set, get) => ({
  users: mockUsers,
  hackathons: mockHackathons,
  currentUser: null,
  teamRequests: [],
  filteredUsers: mockUsers,
  teams: [],
  messages: [],
  notifications: [],
  darkMode: false,
  
  setCurrentUser: (user) => set({ currentUser: user }),
  
  sendTeamRequest: (request) => set((state) => {
    const newRequest = {
      id: Math.random().toString(36).substring(2, 9),
      ...request,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    
    // Add notification for the receiver
    const notification = {
      userId: request.receiverId,
      type: 'teamRequest',
      message: `You have a new team request for a hackathon`,
      relatedId: newRequest.id,
    };
    
    get().addNotification(notification);
    
    return {
      teamRequests: [...state.teamRequests, newRequest],
    };
  }),
  
  updateTeamRequestStatus: (id, status) => set((state) => ({
    teamRequests: state.teamRequests.map((request) =>
      request.id === id ? { ...request, status } : request
    ),
  })),
  
  filterUsers: (filters) => set((state) => {
    let filtered = [...state.users];
    
    // Filter by skills
    if (filters.skills && filters.skills.length > 0) {
      filtered = filtered.filter((user) => 
        user.skills.some((skill) => filters.skills?.includes(skill.name))
      );
    }
    
    // Filter by location
    if (filters.location) {
      filtered = filtered.filter((user) => 
        user.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }
    
    // Filter by event type preference
    if (filters.eventType) {
      filtered = filtered.filter((user) => 
        user.preferences.eventType === filters.eventType
      );
    }
    
    // Filter by availability
    if (filters.availability && filters.availability.length > 0) {
      filtered = filtered.filter((user) => 
        user.preferences.availability.some((time) => 
          filters.availability?.includes(time)
        )
      );
    }
    
    // Filter by experience level
    if (filters.experience && filters.experience.length > 0) {
      filtered = filtered.filter((user) => 
        user.skills.some((skill) => 
          filters.experience?.includes(skill.level)
        )
      );
    }
    
    // Filter by users looking for team
    if (filters.lookingForTeam !== undefined) {
      filtered = filtered.filter((user) => 
        user.lookingForTeam === filters.lookingForTeam
      );
    }
    
    // Filter by hackathon interest
    if (filters.hackathonInterest) {
      // In a real app, this would check user's hackathon interests
      // For now, include all users as a placeholder
    }
    
    // Calculate match percentage for each user if currentUser exists
    if (state.currentUser) {
      filtered = filtered.map(user => ({
        ...user,
        matchPercentage: user.id !== state.currentUser?.id 
          ? calculateCompatibility(state.currentUser!, user) 
          : 0
      }));
      
      // Sort by match percentage (descending)
      filtered.sort((a, b) => (b.matchPercentage || 0) - (a.matchPercentage || 0));
    }
    
    return { filteredUsers: filtered };
  }),
  
  createTeam: (team) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newTeam = {
      id,
      ...team,
      createdAt: new Date().toISOString(),
    };
    
    set((state) => ({
      teams: [...state.teams, newTeam],
    }));
    
    // Notify team members
    team.members.forEach(memberId => {
      if (memberId !== team.leader) {
        get().addNotification({
          userId: memberId,
          type: 'teamJoined',
          message: `You've been added to team ${team.name}`,
          relatedId: id,
        });
      }
    });
    
    return id;
  },
  
  joinTeam: (teamId, userId) => set((state) => {
    const updatedTeams = state.teams.map(team => {
      if (team.id === teamId && !team.members.includes(userId)) {
        // Add notification for team leader
        get().addNotification({
          userId: team.leader,
          type: 'teamJoined',
          message: `A new member has joined your team ${team.name}`,
          relatedId: teamId,
        });
        
        return {
          ...team,
          members: [...team.members, userId]
        };
      }
      return team;
    });
    
    return { teams: updatedTeams };
  }),
  
  leaveTeam: (teamId, userId) => set((state) => {
    const updatedTeams = state.teams.map(team => {
      if (team.id === teamId) {
        // Add notification for team leader
        if (team.leader !== userId) {
          get().addNotification({
            userId: team.leader,
            type: 'teamJoined',
            message: `A member has left your team ${team.name}`,
            relatedId: teamId,
          });
        }
        
        return {
          ...team,
          members: team.members.filter(id => id !== userId)
        };
      }
      return team;
    });
    
    return { teams: updatedTeams };
  }),
  
  sendMessage: (message) => set((state) => {
    const newMessage = {
      id: Math.random().toString(36).substring(2, 9),
      ...message,
      createdAt: new Date().toISOString(),
      read: false,
    };
    
    // Add notification for the receiver
    get().addNotification({
      userId: message.receiverId,
      type: 'message',
      message: `You have a new message`,
      relatedId: newMessage.id,
    });
    
    return {
      messages: [...state.messages, newMessage],
    };
  }),
  
  markMessageAsRead: (messageId) => set((state) => ({
    messages: state.messages.map(message => 
      message.id === messageId ? { ...message, read: true } : message
    ),
  })),
  
  addNotification: (notification) => set((state) => ({
    notifications: [
      ...state.notifications,
      {
        id: Math.random().toString(36).substring(2, 9),
        ...notification,
        createdAt: new Date().toISOString(),
        read: false,
      }
    ],
  })),
  
  markNotificationAsRead: (notificationId) => set((state) => ({
    notifications: state.notifications.map(notification => 
      notification.id === notificationId ? { ...notification, read: true } : notification
    ),
  })),
  
  toggleDarkMode: () => set((state) => {
    const newDarkMode = !state.darkMode;
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
    
    return { darkMode: newDarkMode };
  }),
  
  calculateMatchScore: (userId, otherUserId) => {
    const { users } = get();
    const user1 = users.find(u => u.id === userId);
    const user2 = users.find(u => u.id === otherUserId);
    
    if (!user1 || !user2) return 0;
    
    return calculateCompatibility(user1, user2);
  },
}));