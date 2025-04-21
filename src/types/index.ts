export interface User {
  id: string;
  name: string;
  location: string;
  avatar: string;
  skills: Skill[];
  bio: string;
  preferredCommunication: string;
  pastProjects: Project[];
  preferences: {
    eventType: 'online' | 'offline' | 'hybrid';
    teamRole: string[];
    timezone: string;
    availability: string[];
  };
  rating: number;
  githubUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  matchPercentage?: number; // Added for match algorithm
  achievements?: Achievement[]; // Added for gamification
  lookingForTeam?: boolean; // Added to indicate active search status
}

export interface Skill {
  id: string;
  name: string;
  category: 'frontend' | 'backend' | 'blockchain' | 'design' | 'project management' | 'other';
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsOfExperience?: number; // Added for more detailed skill info
  endorsements?: number; // Added for skill validation by peers
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  imageUrl?: string;
  hackathonId?: string;
  teamMembers?: string[]; // Added to track collaborators
  achievements?: string[]; // Added for project outcomes/awards
}

export interface Hackathon {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  isOnline: boolean;
  prizes: string[];
  organizer: string;
  organizerLogo: string;
  registrationDeadline: string;
  maxTeamSize: number;
  minTeamSize: number;
  website: string;
  categories: string[];
  tags: string[];
  participants?: User[]; // Added to track who's participating
  teams?: Team[]; // Added to track formed teams
  skillsInDemand?: string[]; // Added to highlight needed skills
}

export interface TeamRequest {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  hackathonId: string;
}

export interface Review {
  id: string;
  reviewerId: string;
  userId: string;
  rating: number;
  comment: string;
  hackathonId: string;
  createdAt: string;
}

// New interfaces for enhanced features

export interface Team {
  id: string;
  name: string;
  hackathonId: string;
  members: string[]; // User IDs
  leader: string; // User ID of team leader
  description: string;
  lookingForRoles: string[]; // Skills/roles the team is looking for
  createdAt: string;
  projectRepo?: string; // GitHub/GitLab repository
  projectDemo?: string; // Demo link
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  read: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  dateEarned: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'teamRequest' | 'message' | 'hackathonReminder' | 'teamJoined' | 'connectionRequest';
  message: string;
  relatedId?: string; // ID related to the notification (e.g., hackathon ID, team ID)
  read: boolean;
  createdAt: string;
}