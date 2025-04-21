import { create } from 'zustand';
import { supabase, handleError } from '../lib/supabase';
import { useAuthStore } from './authStore';
import { Database } from '../types/supabase';
import { Hackathon, Team, TeamRequest, User, Skill, Project, Notification, Message } from '../types';

interface DataState {
  users: User[];
  hackathons: Hackathon[];
  teams: Team[];
  teamRequests: TeamRequest[];
  messages: Message[];
  notifications: Notification[];
  filteredUsers: User[];
  loading: {
    users: boolean;
    hackathons: boolean;
    teams: boolean;
    teamRequests: boolean;
    messages: boolean;
    notifications: boolean;
  };
  error: string | null;
  
  // User functions
  fetchUsers: () => Promise<void>;
  fetchUserById: (id: string) => Promise<User | null>;
  fetchUserSkills: (userId: string) => Promise<Skill[]>;
  fetchUserProjects: (userId: string) => Promise<Project[]>;
  
  // Hackathon functions
  fetchHackathons: () => Promise<void>;
  fetchHackathonById: (id: string) => Promise<Hackathon | null>;
  
  // Team functions
  fetchTeams: () => Promise<void>;
  fetchTeamById: (id: string) => Promise<Team | null>;
  createTeam: (team: Omit<Team, 'id' | 'createdAt'>) => Promise<string | null>;
  joinTeam: (teamId: string, userId: string) => Promise<void>;
  leaveTeam: (teamId: string, userId: string) => Promise<void>;
  
  // Team requests functions
  fetchTeamRequests: () => Promise<void>;
  sendTeamRequest: (request: Omit<TeamRequest, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  updateTeamRequestStatus: (id: string, status: 'accepted' | 'rejected') => Promise<void>;
  
  // Message functions
  fetchMessages: () => Promise<void>;
  sendMessage: (message: Omit<Message, 'id' | 'createdAt' | 'read'>) => Promise<void>;
  markMessageAsRead: (messageId: string) => Promise<void>;
  
  // Notification functions
  fetchNotifications: () => Promise<void>;
  markNotificationAsRead: (notificationId: string) => Promise<void>;
  
  // Filter functions
  filterUsers: (filters: {
    skills?: string[];
    location?: string;
    eventType?: 'online' | 'offline' | 'hybrid';
    availability?: string[];
    experience?: string[];
    lookingForTeam?: boolean;
  }) => void;
  
  calculateMatchScore: (userId: string, otherUserId: string) => number;
  clearError: () => void;
}

export const useDataStore = create<DataState>((set, get) => ({
  users: [],
  hackathons: [],
  teams: [],
  teamRequests: [],
  messages: [],
  notifications: [],
  filteredUsers: [],
  loading: {
    users: false,
    hackathons: false,
    teams: false,
    teamRequests: false,
    messages: false,
    notifications: false,
  },
  error: null,
  
  // User functions
  fetchUsers: async () => {
    try {
      set(state => ({ loading: { ...state.loading, users: true }, error: null }));
      
      // Fetch profiles from Supabase
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');
        
      if (profilesError) throw profilesError;
      
      // Transform profiles to our User type
      const users = await Promise.all(profiles.map(async (profile) => {
        // Fetch skills for each user
        const { data: skills } = await supabase
          .from('skills')
          .select('*')
          .eq('user_id', profile.id);
          
        // Fetch projects for each user
        const { data: projects } = await supabase
          .from('projects')
          .select('*')
          .eq('user_id', profile.id);
          
        // Transform to our User type
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          location: 'Unknown', // This would need to be added to the profiles table
          avatar: profile.avatar_url || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
          skills: skills?.map(s => ({
            id: s.id,
            name: s.name,
            category: s.category as any,
            level: s.level as any,
          })) || [],
          bio: 'No bio yet', // This would need to be added to the profiles table
          preferredCommunication: 'Email',
          pastProjects: projects?.map(p => ({
            id: p.id,
            name: p.name,
            description: p.description,
            technologies: p.technologies,
            url: p.url || undefined,
            imageUrl: p.image_url || undefined,
          })) || [],
          preferences: {
            eventType: 'hybrid',
            teamRole: ['Developer'],
            timezone: 'GMT',
            availability: ['Weekends'],
          },
          rating: 4.5,
          githubUrl: undefined,
          linkedinUrl: undefined,
          twitterUrl: undefined,
        };
      }));
      
      set({ users, filteredUsers: users });
    } catch (error: any) {
      set({ error: handleError(error) });
    } finally {
      set(state => ({ loading: { ...state.loading, users: false } }));
    }
  },
  
  fetchUserById: async (id) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      if (!profile) return null;
      
      // Fetch skills for the user
      const { data: skills } = await supabase
        .from('skills')
        .select('*')
        .eq('user_id', id);
        
      // Fetch projects for the user
      const { data: projects } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', id);
      
      // Transform to our User type
      return {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        location: 'Unknown',
        avatar: profile.avatar_url || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
        skills: skills?.map(s => ({
          id: s.id,
          name: s.name,
          category: s.category as any,
          level: s.level as any,
        })) || [],
        bio: 'No bio yet',
        preferredCommunication: 'Email',
        pastProjects: projects?.map(p => ({
          id: p.id,
          name: p.name,
          description: p.description,
          technologies: p.technologies,
          url: p.url || undefined,
          imageUrl: p.image_url || undefined,
        })) || [],
        preferences: {
          eventType: 'hybrid',
          teamRole: ['Developer'],
          timezone: 'GMT',
          availability: ['Weekends'],
        },
        rating: 4.5,
        githubUrl: undefined,
        linkedinUrl: undefined,
        twitterUrl: undefined,
      };
    } catch (error: any) {
      console.error('Error fetching user by ID:', error);
      return null;
    }
  },
  
  fetchUserSkills: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .eq('user_id', userId);
        
      if (error) throw error;
      
      return data.map(s => ({
        id: s.id,
        name: s.name,
        category: s.category as any,
        level: s.level as any,
      }));
    } catch (error: any) {
      console.error('Error fetching user skills:', error);
      return [];
    }
  },
  
  fetchUserProjects: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId);
        
      if (error) throw error;
      
      return data.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        technologies: p.technologies,
        url: p.url || undefined,
        imageUrl: p.image_url || undefined,
      }));
    } catch (error: any) {
      console.error('Error fetching user projects:', error);
      return [];
    }
  },
  
  // Hackathon functions
  fetchHackathons: async () => {
    try {
      set(state => ({ loading: { ...state.loading, hackathons: true }, error: null }));
      
      const { data, error } = await supabase
        .from('hackathons')
        .select('*')
        .order('start_date', { ascending: true });
        
      if (error) throw error;
      
      const hackathons = data.map(h => ({
        id: h.id,
        name: h.name,
        description: h.description,
        startDate: h.start_date,
        endDate: h.end_date,
        location: h.location,
        isOnline: h.is_online,
        prizes: h.prizes,
        organizer: h.organizer,
        organizerLogo: h.organizer_logo,
        registrationDeadline: h.registration_deadline,
        maxTeamSize: h.max_team_size,
        minTeamSize: h.min_team_size,
        website: h.website,
        categories: h.categories,
        tags: h.tags,
      }));
      
      set({ hackathons });
    } catch (error: any) {
      set({ error: handleError(error) });
    } finally {
      set(state => ({ loading: { ...state.loading, hackathons: false } }));
    }
  },
  
  fetchHackathonById: async (id) => {
    try {
      const { data, error } = await supabase
        .from('hackathons')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      if (!data) return null;
      
      return {
        id: data.id,
        name: data.name,
        description: data.description,
        startDate: data.start_date,
        endDate: data.end_date,
        location: data.location,
        isOnline: data.is_online,
        prizes: data.prizes,
        organizer: data.organizer,
        organizerLogo: data.organizer_logo,
        registrationDeadline: data.registration_deadline,
        maxTeamSize: data.max_team_size,
        minTeamSize: data.min_team_size,
        website: data.website,
        categories: data.categories,
        tags: data.tags,
      };
    } catch (error: any) {
      console.error('Error fetching hackathon by ID:', error);
      return null;
    }
  },
  
  // Team functions
  fetchTeams: async () => {
    try {
      set(state => ({ loading: { ...state.loading, teams: true }, error: null }));
      
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      const teams = data.map(t => ({
        id: t.id,
        name: t.name,
        hackathonId: t.hackathon_id,
        members: t.members,
        leader: t.leader,
        description: t.description,
        lookingForRoles: t.looking_for_roles,
        createdAt: t.created_at || new Date().toISOString(),
        projectRepo: t.project_repo || undefined,
        projectDemo: t.project_demo || undefined,
      }));
      
      set({ teams });
    } catch (error: any) {
      set({ error: handleError(error) });
    } finally {
      set(state => ({ loading: { ...state.loading, teams: false } }));
    }
  },
  
  fetchTeamById: async (id) => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      if (!data) return null;
      
      return {
        id: data.id,
        name: data.name,
        hackathonId: data.hackathon_id,
        members: data.members,
        leader: data.leader,
        description: data.description,
        lookingForRoles: data.looking_for_roles,
        createdAt: data.created_at || new Date().toISOString(),
        projectRepo: data.project_repo || undefined,
        projectDemo: data.project_demo || undefined,
      };
    } catch (error: any) {
      console.error('Error fetching team by ID:', error);
      return null;
    }
  },
  
  createTeam: async (team) => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .insert({
          name: team.name,
          hackathon_id: team.hackathonId,
          members: team.members,
          leader: team.leader,
          description: team.description,
          looking_for_roles: team.lookingForRoles,
          project_repo: team.projectRepo || null,
          project_demo: team.projectDemo || null,
        })
        .select()
        .single();
        
      if (error) throw error;
      
      // Add the new team to the store
      const newTeam: Team = {
        id: data.id,
        name: data.name,
        hackathonId: data.hackathon_id,
        members: data.members,
        leader: data.leader,
        description: data.description,
        lookingForRoles: data.looking_for_roles,
        createdAt: data.created_at || new Date().toISOString(),
        projectRepo: data.project_repo || undefined,
        projectDemo: data.project_demo || undefined,
      };
      
      set(state => ({ teams: [...state.teams, newTeam] }));
      
      // Create notifications for team members
      for (const memberId of team.members) {
        if (memberId !== team.leader) {
          await supabase
            .from('notifications')
            .insert({
              user_id: memberId,
              type: 'teamJoined',
              message: `You've been added to team ${team.name}`,
              related_id: data.id,
              read: false,
            });
        }
      }
      
      return data.id;
    } catch (error: any) {
      console.error('Error creating team:', error);
      return null;
    }
  },
  
  joinTeam: async (teamId, userId) => {
    try {
      // First, fetch the current team data
      const { data: team, error: fetchError } = await supabase
        .from('teams')
        .select('*')
        .eq('id', teamId)
        .single();
        
      if (fetchError) throw fetchError;
      if (!team) throw new Error('Team not found');
      
      // Add the user to the members array if not already present
      if (!team.members.includes(userId)) {
        const updatedMembers = [...team.members, userId];
        
        // Update the team in the database
        const { error: updateError } = await supabase
          .from('teams')
          .update({ members: updatedMembers })
          .eq('id', teamId);
          
        if (updateError) throw updateError;
        
        // Create notification for the team leader
        await supabase
          .from('notifications')
          .insert({
            user_id: team.leader,
            type: 'teamJoined',
            message: `A new member has joined your team ${team.name}`,
            related_id: teamId,
            read: false,
          });
        
        // Update the teams in the store
        set(state => ({
          teams: state.teams.map(t => 
            t.id === teamId ? { ...t, members: updatedMembers } : t
          ),
        }));
      }
    } catch (error: any) {
      console.error('Error joining team:', error);
    }
  },
  
  leaveTeam: async (teamId, userId) => {
    try {
      // First, fetch the current team data
      const { data: team, error: fetchError } = await supabase
        .from('teams')
        .select('*')
        .eq('id', teamId)
        .single();
        
      if (fetchError) throw fetchError;
      if (!team) throw new Error('Team not found');
      
      // Remove the user from the members array
      const updatedMembers = team.members.filter(id => id !== userId);
      
      // Update the team in the database
      const { error: updateError } = await supabase
        .from('teams')
        .update({ members: updatedMembers })
        .eq('id', teamId);
        
      if (updateError) throw updateError;
      
      // Create notification for the team leader if the user is not the leader
      if (team.leader !== userId) {
        await supabase
          .from('notifications')
          .insert({
            user_id: team.leader,
            type: 'teamJoined',
            message: `A member has left your team ${team.name}`,
            related_id: teamId,
            read: false,
          });
      }
      
      // Update the teams in the store
      set(state => ({
        teams: state.teams.map(t => 
          t.id === teamId ? { ...t, members: updatedMembers } : t
        ),
      }));
    } catch (error: any) {
      console.error('Error leaving team:', error);
    }
  },
  
  // Team requests functions
  fetchTeamRequests: async () => {
    try {
      set(state => ({ loading: { ...state.loading, teamRequests: true }, error: null }));
      
      const user = useAuthStore.getState().user;
      if (!user) {
        throw new Error('No authenticated user');
      }
      
      const { data, error } = await supabase
        .from('team_requests')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      const teamRequests = data.map(tr => ({
        id: tr.id,
        senderId: tr.sender_id,
        receiverId: tr.receiver_id,
        message: tr.message,
        status: tr.status,
        createdAt: tr.created_at || new Date().toISOString(),
        hackathonId: tr.hackathon_id,
      }));
      
      set({ teamRequests });
    } catch (error: any) {
      set({ error: handleError(error) });
    } finally {
      set(state => ({ loading: { ...state.loading, teamRequests: false } }));
    }
  },
  
  sendTeamRequest: async (request) => {
    try {
      const { data, error } = await supabase
        .from('team_requests')
        .insert({
          sender_id: request.senderId,
          receiver_id: request.receiverId,
          message: request.message,
          status: 'pending',
          hackathon_id: request.hackathonId,
        })
        .select()
        .single();
        
      if (error) throw error;
      
      // Add the new request to the store
      const newRequest: TeamRequest = {
        id: data.id,
        senderId: data.sender_id,
        receiverId: data.receiver_id,
        message: data.message,
        status: data.status,
        createdAt: data.created_at || new Date().toISOString(),
        hackathonId: data.hackathon_id,
      };
      
      set(state => ({ teamRequests: [...state.teamRequests, newRequest] }));
      
      // Create notification for the receiver
      await supabase
        .from('notifications')
        .insert({
          user_id: request.receiverId,
          type: 'teamRequest',
          message: `You have a new team request for a hackathon`,
          related_id: data.id,
          read: false,
        });
    } catch (error: any) {
      console.error('Error sending team request:', error);
    }
  },
  
  updateTeamRequestStatus: async (id, status) => {
    try {
      const { error } = await supabase
        .from('team_requests')
        .update({ status })
        .eq('id', id);
        
      if (error) throw error;
      
      // Update the team requests in the store
      set(state => ({
        teamRequests: state.teamRequests.map(tr => 
          tr.id === id ? { ...tr, status } : tr
        ),
      }));
      
      // If the request was accepted, automatically add the user to the team
      if (status === 'accepted') {
        const request = get().teamRequests.find(tr => tr.id === id);
        if (request) {
          // Find the team associated with the hackathon that the sender is requesting to join
          const { data: teams } = await supabase
            .from('teams')
            .select('*')
            .eq('hackathon_id', request.hackathonId);
            
          if (teams && teams.length > 0) {
            // For this example, we'll just add the user to the first team for this hackathon
            await get().joinTeam(teams[0].id, request.senderId);
          }
        }
      }
    } catch (error: any) {
      console.error('Error updating team request status:', error);
    }
  },
  
  // Message functions
  fetchMessages: async () => {
    try {
      set(state => ({ loading: { ...state.loading, messages: true }, error: null }));
      
      const user = useAuthStore.getState().user;
      if (!user) {
        throw new Error('No authenticated user');
      }
      
      // Fetch all messages sent by or to the current user
      const { data, error } = await supabase
        .from('direct_messages')
        .select('*')
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      const messages = data.map(m => ({
        id: m.id.toString(),
        senderId: m.sender_id,
        receiverId: m.recipient_id,
        content: m.content,
        createdAt: m.created_at || new Date().toISOString(),
        read: m.read || false,
      }));
      
      set({ messages });
    } catch (error: any) {
      set({ error: handleError(error) });
    } finally {
      set(state => ({ loading: { ...state.loading, messages: false } }));
    }
  },
  
  sendMessage: async (message) => {
    try {
      const { data, error } = await supabase
        .from('direct_messages')
        .insert({
          sender_id: message.senderId,
          recipient_id: message.receiverId,
          content: message.content,
          read: false,
        })
        .select()
        .single();
        
      if (error) throw error;
      
      // Add the new message to the store
      const newMessage: Message = {
        id: data.id.toString(),
        senderId: data.sender_id,
        receiverId: data.recipient_id,
        content: data.content,
        createdAt: data.created_at || new Date().toISOString(),
        read: data.read || false,
      };
      
      set(state => ({ messages: [newMessage, ...state.messages] }));
      
      // Create notification for the receiver
      await supabase
        .from('notifications')
        .insert({
          user_id: message.receiverId,
          type: 'message',
          message: `You have a new message`,
          related_id: data.id.toString(),
          read: false,
        });
    } catch (error: any) {
      console.error('Error sending message:', error);
    }
  },
  
  markMessageAsRead: async (messageId) => {
    try {
      const { error } = await supabase
        .from('direct_messages')
        .update({ read: true })
        .eq('id', messageId);
        
      if (error) throw error;
      
      // Update the messages in the store
      set(state => ({
        messages: state.messages.map(m => 
          m.id === messageId ? { ...m, read: true } : m
        ),
      }));
    } catch (error: any) {
      console.error('Error marking message as read:', error);
    }
  },
  
  // Notification functions
  fetchNotifications: async () => {
    try {
      set(state => ({ loading: { ...state.loading, notifications: true }, error: null }));
      
      const user = useAuthStore.getState().user;
      if (!user) {
        throw new Error('No authenticated user');
      }
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      const notifications = data.map(n => ({
        id: n.id,
        userId: n.user_id,
        type: n.type as any,
        message: n.message,
        relatedId: n.related_id || undefined,
        read: n.read,
        createdAt: n.created_at || new Date().toISOString(),
      }));
      
      set({ notifications });
    } catch (error: any) {
      set({ error: handleError(error) });
    } finally {
      set(state => ({ loading: { ...state.loading, notifications: false } }));
    }
  },
  
  markNotificationAsRead: async (notificationId) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);
        
      if (error) throw error;
      
      // Update the notifications in the store
      set(state => ({
        notifications: state.notifications.map(n => 
          n.id === notificationId ? { ...n, read: true } : n
        ),
      }));
    } catch (error: any) {
      console.error('Error marking notification as read:', error);
    }
  },
  
  // Filter functions
  filterUsers: (filters) => {
    const { users } = get();
    let filtered = [...users];
    
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
    
    // Calculate match percentage for each user if currentUser exists
    const user = useAuthStore.getState().user;
    if (user) {
      filtered = filtered.map(u => ({
        ...u,
        matchPercentage: u.id !== user.id 
          ? get().calculateMatchScore(user.id, u.id) 
          : 0
      }));
      
      // Sort by match percentage (descending)
      filtered.sort((a, b) => (b.matchPercentage || 0) - (a.matchPercentage || 0));
    }
    
    set({ filteredUsers: filtered });
  },
  
  calculateMatchScore: (userId, otherUserId) => {
    const { users } = get();
    const user1 = users.find(u => u.id === userId);
    const user2 = users.find(u => u.id === otherUserId);
    
    if (!user1 || !user2) return 0;
    
    let score = 0;
    const maxScore = 100;
    
    // Skill complementarity (different skills increase score)
    const user1Skills = new Set(user1.skills.map(s => s.name));
    const user2Skills = new Set(user2.skills.map(s => s.name));
    
    // Check for empty sets to avoid division by zero
    if (user2Skills.size > 0) {
      const differentSkills = [...user2Skills].filter(s => !user1Skills.has(s));
      score += (differentSkills.length / user2Skills.size) * 30; // 30% weight for complementary skills
    } else {
      score += 15; // Default score if no skills are defined
    }
    
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
    
    // Check for empty sets to avoid division by zero
    if (availability2.size > 0) {
      const matchingAvailability = [...availability2].filter(a => availability1.has(a));
      score += (matchingAvailability.length / availability2.size) * 20; // 20% weight for matching availability
    } else {
      score += 10; // Default score if no availability is defined
    }
    
    // Same hackathon interests (to be expanded with real data)
    score += 20; // Placeholder: 20% weight for potential hackathon interest alignment
    
    return Math.min(Math.round(score), maxScore);
  },
  
  clearError: () => set({ error: null }),
}));