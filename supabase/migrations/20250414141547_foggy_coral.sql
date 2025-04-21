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

-- Add more upcoming hackathons for variety
INSERT INTO hackathons (name, description, start_date, end_date, location, is_online, prizes, organizer, organizer_logo, registration_deadline, max_team_size, min_team_size, website, categories, tags)
VALUES 
  (
    'Polygon Buildathon',
    'Build scalable applications on Polygon with a focus on performance and user experience.',
    '2025-10-15 00:00:00Z',
    '2025-10-30 00:00:00Z',
    'Online',
    true,
    ARRAY['$75,000 in prizes', 'Grants for promising projects', 'Technical mentorship'],
    'Polygon Labs',
    'https://images.unsplash.com/photo-1639322537231-2f206e06af84?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
    '2025-10-10 00:00:00Z',
    5,
    1,
    'https://polygon.technology/hackathon',
    ARRAY['DeFi', 'Gaming', 'Web3 Social', 'Infrastructure'],
    ARRAY['Polygon', 'Ethereum', 'Scaling', 'Web3']
  ),
  (
    'Consensys Web3 Hackathon',
    'Join the premier Ethereum development event focusing on DeFi and decentralized applications.',
    '2025-11-05 00:00:00Z',
    '2025-11-15 00:00:00Z',
    'London, UK',
    false,
    ARRAY['$60,000 in prizes', 'Incubation opportunities', 'Investor introductions'],
    'Consensys',
    'https://images.unsplash.com/photo-1643553212551-2530979aa3b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
    '2025-10-25 00:00:00Z',
    4,
    2,
    'https://consensys.net/events/hackathon',
    ARRAY['DeFi', 'Governance', 'Identity', 'Security'],
    ARRAY['Ethereum', 'Smart Contracts', 'MetaMask', 'Web3']
  );

-- Note: In a real application, you would not seed user profiles as they would be created by actual user registrations.
-- This is just for demo purposes.

-- Add sample skill categories and examples
DO $$
DECLARE
  sample_user_id UUID;
  hackathon_id UUID;
  team_id UUID;
BEGIN
  -- Insert sample skills for users (requires profiles to exist)
  -- This is a placeholder that would typically happen when real users register and add skills
  -- If a real profile exists, we can add some sample skills to it
  SELECT id INTO sample_user_id FROM profiles LIMIT 1;
  SELECT id INTO hackathon_id FROM hackathons LIMIT 1;
  
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
    
    -- Add a sample team if the user exists
    INSERT INTO teams (name, description, hackathon_id, members, leader, looking_for_roles)
    VALUES (
      'Web3 Wizards',
      'We are building a decentralized identity solution for healthcare data sharing. Looking for developers with experience in zero-knowledge proofs and frontend development.',
      hackathon_id,
      ARRAY[sample_user_id],
      sample_user_id,
      ARRAY['Frontend Developer', 'Smart Contract Developer', 'UI/UX Designer']
    ) RETURNING id INTO team_id;
    
    -- Add sample notifications
    INSERT INTO notifications (user_id, type, message, related_id, read)
    VALUES 
      (sample_user_id, 'hackathonReminder', 'ETHGlobal New York starts in 1 week. Complete your team registration!', hackathon_id, false),
      (sample_user_id, 'teamJoined', 'You have created team Web3 Wizards for ETHGlobal New York', team_id, true);
  END IF;
END $$;