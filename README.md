# Hackathon Team Finder

A modern web application to help users find, join, and manage hackathon teams. Built with React, TypeScript, Supabase, Zustand, and TailwindCSS, this platform streamlines the process of discovering hackathons, connecting with participants, and forming teams.

## Features

- 🚀 Discover upcoming hackathons and view event details
- 👥 Search for participants and teams by skills or interests
- 📝 User authentication and profile management (Supabase Auth)
- 🛡️ Protected routes for authenticated users (dashboard, messages, notifications, settings)
- 💬 Team and participant messaging
- 🌗 Dark mode support
- 🔔 Toast notifications for real-time feedback
- ⚡ Fast, modern UI with TailwindCSS

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** TailwindCSS
- **State Management:** Zustand
- **Backend/Auth:** Supabase
- **Routing:** React Router DOM
- **Form Handling:** React Hook Form
- **Notifications:** React Hot Toast

## Getting Started

### Prerequisites
- Node.js (v18 or above recommended)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd HackTeamFind
   ```
2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```
3. **Configure Supabase:**
   - Set up a Supabase project at [supabase.com](https://supabase.com/)
   - Create a `.env` file in the root directory and add your Supabase credentials:
     ```env
     VITE_SUPABASE_URL=your-supabase-url
     VITE_SUPABASE_ANON_KEY=your-anon-key
     ```
4. **Start the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   The app will be available at [http://localhost:5173](http://localhost:5173) by default.

## Usage

- Sign up or log in to access hackathons, team search, and messaging features.
- Browse hackathons, view details, and join or create teams.
- Manage your profile and team memberships from the dashboard.
- Use the dark mode toggle for a comfortable viewing experience.

## Project Structure

```
HackTeamFind/
├── dist/                 # Production build output
├── public/               # Static assets
├── src/                  # Source code
│   ├── components/       # Reusable UI components
│   ├── pages/            # Route-based pages
│   ├── store/            # Zustand state stores
│   ├── types/            # TypeScript types
│   ├── lib/              # Supabase client setup
│   └── ...
├── supabase/             # Supabase configuration (if any)
├── tailwind.config.js    # TailwindCSS config
├── vite.config.ts        # Vite config
├── package.json          # Project metadata & scripts
└── README.md
```

## License

This project is licensed under the MIT License.

---

*Built with ❤️ for hackathon enthusiasts.*
