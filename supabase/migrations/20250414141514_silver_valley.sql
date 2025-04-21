/*
  # Initial Schema for Hackathon Team Finder Application

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users.id)
      - `name` (text, not null)
      - `email` (text, not null, unique)
      - `avatar_url` (text, nullable)
      - `role` (text, defaults to 'member')
      - `created_at` (timestamptz, default now())
      - `location` (text, nullable)
      - `bio` (text, nullable)
      - `github_url` (text, nullable)
      - `linkedin_url` (text, nullable)
      - `twitter_url` (text, nullable)
      - `preferred_communication` (text, nullable)
      - `event_type` (text, default 'hybrid')
      - `timezone` (text, default 'GMT')
      - `team_roles` (text array, nullable)
      - `availability` (text array, nullable)
    
    - `skills`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `category` (text, not null)
      - `level` (text, not null)
      - `user_id` (uuid, references profiles.id)
    
    - `hackathons`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `description` (text, not null)
      - `start_date` (timestamptz, not null)
      - `end_date` (timestamptz, not null)
      - `location` (text, not null)
      - `is_online` (boolean, not null)
      - `prizes` (text array, not null)
      - `organizer` (text, not null)
      - `organizer_logo` (text, not null)
      - `registration_deadline` (timestamptz, not null)
      - `max_team_size` (integer, not null)
      - `min_team_size` (integer, not null)
      - `website` (text, not null)
      - `categories` (text array, not null)
      - `tags` (text array, not null)
      - `created_at` (timestamptz, default now())
    
    - `teams`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `hackathon_id` (uuid, references hackathons.id)
      - `members` (uuid array, not null)
      - `leader` (uuid, not null, references profiles.id)
      - `description` (text, not null)
      - `looking_for_roles` (text array, not null)
      - `project_repo` (text, nullable)
      - `project_demo` (text, nullable)
      - `created_at` (timestamptz, default now())
    
    - `team_requests`
      - `id` (uuid, primary key)
      - `sender_id` (uuid, not null, references profiles.id)
      - `receiver_id` (uuid, not null, references profiles.id)
      - `message` (text, not null)
      - `status` (text, default 'pending')
      - `hackathon_id` (uuid, not null, references hackathons.id)
      - `created_at` (timestamptz, default now())
    
    - `projects`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `description` (text, not null)
      - `technologies` (text array, not null)
      - `url` (text, nullable)
      - `image_url` (text, nullable)
      - `hackathon_id` (uuid, nullable, references hackathons.id)
      - `user_id` (uuid, not null, references profiles.id)
      - `created_at` (timestamptz, default now())
    
    - `direct_messages`
      - `id` (integer, primary key)
      - `sender_id` (uuid, not null, references profiles.id)
      - `recipient_id` (uuid, not null, references profiles.id)
      - `content` (text, not null)
      - `read` (boolean, default false)
      - `created_at` (timestamptz, default now())
    
    - `notifications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, not null, references profiles.id)
      - `type` (text, not null)
      - `message` (text, not null)
      - `related_id` (uuid, nullable)
      - `read` (boolean, default false)
      - `created_at` (timestamptz, default now())
  
  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for each table
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'member',
  created_at TIMESTAMPTZ DEFAULT now(),
  location TEXT,
  bio TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  preferred_communication TEXT DEFAULT 'Email',
  event_type TEXT DEFAULT 'hybrid',
  timezone TEXT DEFAULT 'GMT',
  team_roles TEXT[],
  availability TEXT[]
);

-- Create skills table
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  level TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE
);

-- Create hackathons table
CREATE TABLE IF NOT EXISTS hackathons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  location TEXT NOT NULL,
  is_online BOOLEAN NOT NULL,
  prizes TEXT[] NOT NULL,
  organizer TEXT NOT NULL,
  organizer_logo TEXT NOT NULL,
  registration_deadline TIMESTAMPTZ NOT NULL,
  max_team_size INTEGER NOT NULL,
  min_team_size INTEGER NOT NULL,
  website TEXT NOT NULL,
  categories TEXT[] NOT NULL,
  tags TEXT[] NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create teams table
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  hackathon_id UUID NOT NULL REFERENCES hackathons(id) ON DELETE CASCADE,
  members UUID[] NOT NULL,
  leader UUID NOT NULL REFERENCES profiles(id),
  description TEXT NOT NULL,
  looking_for_roles TEXT[] NOT NULL,
  project_repo TEXT,
  project_demo TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create team_requests table
CREATE TABLE IF NOT EXISTS team_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES profiles(id),
  receiver_id UUID NOT NULL REFERENCES profiles(id),
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  hackathon_id UUID NOT NULL REFERENCES hackathons(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  technologies TEXT[] NOT NULL,
  url TEXT,
  image_url TEXT,
  hackathon_id UUID REFERENCES hackathons(id),
  user_id UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create direct_messages table
CREATE TABLE IF NOT EXISTS direct_messages (
  id SERIAL PRIMARY KEY,
  sender_id UUID NOT NULL REFERENCES profiles(id),
  recipient_id UUID NOT NULL REFERENCES profiles(id),
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  related_id UUID,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE hackathons ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE direct_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles table
CREATE POLICY "Allow signup profile creation" ON profiles FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Create policies for skills table
CREATE POLICY "Skills are viewable by everyone" ON skills FOR SELECT USING (true);
CREATE POLICY "Users can insert their own skills" ON skills FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own skills" ON skills FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own skills" ON skills FOR DELETE USING (auth.uid() = user_id);

-- Create policies for hackathons table
CREATE POLICY "Hackathons are viewable by everyone" ON hackathons FOR SELECT USING (true);
CREATE POLICY "Admin can manage hackathons" ON hackathons FOR ALL USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- Create policies for teams table
CREATE POLICY "Teams are viewable by everyone" ON teams FOR SELECT USING (true);
CREATE POLICY "Team leaders can manage their teams" ON teams FOR ALL USING (auth.uid() = leader);
CREATE POLICY "Members can update their teams" ON teams FOR UPDATE USING (auth.uid() = ANY(members));

-- Create policies for team_requests table
CREATE POLICY "Users can see team requests they're involved in" ON team_requests FOR SELECT 
USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users can send team requests" ON team_requests FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Receivers can update team request status" ON team_requests FOR UPDATE 
USING (auth.uid() = receiver_id);

-- Create policies for projects table
CREATE POLICY "Projects are viewable by everyone" ON projects FOR SELECT USING (true);
CREATE POLICY "Users can manage their own projects" ON projects FOR ALL USING (auth.uid() = user_id);

-- Create policies for direct_messages table
CREATE POLICY "Users can see their own messages" ON direct_messages FOR SELECT 
USING (auth.uid() = sender_id OR auth.uid() = recipient_id);
CREATE POLICY "Users can send messages" ON direct_messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can update received messages" ON direct_messages FOR UPDATE 
USING (auth.uid() = recipient_id);

-- Create policies for notifications table
CREATE POLICY "Users can see their own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);