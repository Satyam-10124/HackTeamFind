/*
  # Seed Data for Hackathon Team Finder Application

  This migration adds sample data to the database for testing and demo purposes.
  
  1. Sample hackathons
  2. Sample profiles
  3. Sample skills for users
  4. Sample projects
  5. Sample teams
*/

-- Add sample hackathons
INSERT INTO hackathons (name, description, start_date, end_date, location, is_online, prizes, organizer, organizer_logo, registration_deadline, max_team_size, min_team_size, website, categories, tags)
VALUES 
  (
    'ETHGlobal New York',
    'Join us for a weekend of building, learning, and connecting with the Ethereum community in New York City.',
    '2025-06-15 00:00:00Z',
    '2025-06-17 00:00:00Z',
    'New York, NY',
    false,
    ARRAY['$50,000 in total prizes', 'Mentorship from top Ethereum projects', 'Job opportunities'],
    'ETHGlobal',
    'https://images.unsplash.com/photo-1622675363311-3e1904dc1885?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
    '2025-06-10 00:00:00Z',
    5,
    2,
    'https://ethglobal.com',
    ARRAY['DeFi', 'NFTs', 'DAOs', 'Gaming'],
    ARRAY['Ethereum', 'Smart Contracts', 'Web3']
  ),
  (
    'Solana Summer Hackathon',
    'Build the future of the Solana ecosystem in this virtual hackathon with workshops, mentorship, and prizes.',
    '2025-07-10 00:00:00Z',
    '2025-07-24 00:00:00Z',
    'Online',
    true,
    ARRAY['$100,000 in SOL and prizes', 'Grant opportunities', 'Ecosystem funding'],
    'Solana Foundation',
    'https://images.unsplash.com/photo-1659153393913-521c748740e5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
    '2025-07-05 00:00:00Z',
    4,
    1,
    'https://solana.com/hackathon',
    ARRAY['DeFi', 'Infrastructure', 'Web3 Social', 'Gaming'],
    ARRAY['Solana', 'Rust', 'Web3']
  ),
  (
    'Hackathon for Social Impact',
    'Use blockchain technology to solve real-world social and environmental challenges.',
    '2025-08-05 00:00:00Z',
    '2025-08-07 00:00:00Z',
    'San Francisco, CA',
    false,
    ARRAY['$30,000 in prizes', 'Incubation opportunities', 'Networking with impact investors'],
    'Blockchain for Social Impact Coalition',
    'https://images.unsplash.com/photo-1598301257982-0cf014dabbcd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
    '2025-07-30 00:00:00Z',
    5,
    2,
    'https://blockchainforsocialimpact.com',
    ARRAY['Healthcare', 'Climate', 'Financial Inclusion', 'Education'],
    ARRAY['Social Impact', 'Blockchain', 'Web3']
  ),
  (
    'Web3 University Hackathon',
    'A global virtual hackathon specifically for university students interested in Web3 technology.',
    '2025-09-20 00:00:00Z',
    '2025-09-22 00:00:00Z',
    'Online',
    true,
    ARRAY['$20,000 in prizes', 'Internship opportunities', 'Developer mentorship'],
    'Web3 Foundation',
    'https://images.unsplash.com/photo-1639762681057-408e52192e55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
    '2025-09-15 00:00:00Z',
    4,
    1,
    'https://web3foundation.com/hackathon',
    ARRAY['DeFi', 'NFTs', 'Gaming', 'Infrastructure'],
    ARRAY['Student', 'Web3', 'Blockchain']
  );

-- Note: In a real application, you would not seed user profiles as they would be created by actual user registrations.
-- This is just for demo purposes.

-- Add sample skill categories and examples
DO $$
DECLARE
  sample_user_id UUID;
BEGIN
  -- Insert sample skills for users (requires profiles to exist)
  -- This is a placeholder that would typically happen when real users register and add skills
  -- If a real profile exists, we can add some sample skills to it
  SELECT id INTO sample_user_id FROM profiles LIMIT 1;
  
  IF sample_user_id IS NOT NULL THEN
    -- Add sample skills for this user
    INSERT INTO skills (name, category, level, user_id)
    VALUES 
      ('React', 'frontend', 'expert', sample_user_id),
      ('TypeScript', 'frontend', 'advanced', sample_user_id),
      ('Solidity', 'blockchain', 'intermediate', sample_user_id),
      ('Web3.js', 'blockchain', 'advanced', sample_user_id);
      
    -- Add sample project for this user
    INSERT INTO projects (name, description, technologies, url, user_id)
    VALUES (
      'DeFi Dashboard',
      'A dashboard to track and manage DeFi investments across multiple chains',
      ARRAY['React', 'TypeScript', 'Web3.js', 'Ethers.js'],
      'https://github.com/user/defi-dashboard',
      sample_user_id
    );
  END IF;
END $$;