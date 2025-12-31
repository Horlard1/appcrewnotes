# AppCrew Notes

A cross-platform note-taking application built with React Native, Expo, and Supabase. Create, manage, and sync your notes seamlessly across iOS, Android, and Web.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Development](#development)
- [Project Structure](#project-structure)
- [Running the Application](#running-the-application)
- [Key Concepts](#key-concepts)
- [Troubleshooting](#troubleshooting)

## Project Overview

AppCrew Notes is a full-featured notes application that allows users to:

- Create and edit notes
- Authenticate securely with email/password
- Sync notes across multiple devices
- Access notes on any platform (iOS, Android, Web)

The app uses Supabase for backend services including authentication and real-time database synchronization, ensuring your notes are always accessible and up-to-date.

## Features

✨ **Core Features:**

- 🔐 Secure user authentication (Sign up/Sign in)
- 📝 Create, edit, and delete notes
- ☁️ Real-time cloud synchronization via Supabase
- 🔄 Automatic session persistence
- 📱 Cross-platform support (iOS, Android, Web)
- 🎨 Responsive UI with Expo components
- ⌨️ Type-safe development with TypeScript

## Tech Stack

### Frontend

- **React Native** (v0.81.4) - Cross-platform mobile framework
- **Expo** (v54.0.10) - Managed React Native platform
- **Expo Router** (v6.0.8) - File-based routing
- **React** (v19.1.0) - UI library
- **TypeScript** (v5.9.2) - Type safety
- **React Navigation** - Navigation management

### Backend & Services

- **Supabase** - Backend-as-a-Service (Authentication, PostgreSQL database)
- **AsyncStorage** - Client-side data persistence

### UI & Styling

- **Expo Vector Icons** - Icon library
- **Lucide React Native** - UI icons
- **Expo Linear Gradient** - Gradient backgrounds
- **Expo Blur** - Blur effects

### Utilities

- **date-fns** (v4.1.0) - Date manipulation
- **Zod** (v4.2.1) - Schema validation
- **React Native URL Polyfill** - URL polyfill for React Native

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org)
- **npm** or **yarn** - Package manager (comes with Node.js)
- **Expo CLI** - Install globally with `npm install -g expo-cli`
- **Git** - Version control ([Download](https://git-scm.com))
- **Supabase Account** - [Sign up at supabase.com](https://supabase.com)

### Optional (for native development)

- **Xcode** (macOS only) - For iOS development
- **Android Studio** - For Android development
- **EAS CLI** - For building with Expo Application Services (`npm install -g eas-cli`)

## Installation

### Step 1: Clone the Repository

```bash
cd /path/to/your/workspace
git clone <repository-url>
cd project
```

### Step 2: Install Dependencies

```bash
npm install
# or
yarn install
```

This will install all required packages listed in `package.json`.

### Step 3: Verify Installation

Check that all installations were successful:

```bash
npm list
expo --version
```

## Configuration

### Step 1: Set Up Supabase Project

1. Go to [Supabase Console](https://app.supabase.com)
2. Create a new project or use an existing one
3. Note your project's:
   - **Project URL** (Public API URL)
   - **Anon Key** (Publicly safe key for client-side access)

### Step 2: Create Database Schema

In your Supabase project's SQL editor, run the following query to create the notes table:

```sql
CREATE TABLE notes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX idx_notes_user_id ON notes(user_id);

-- Enable RLS (Row Level Security)
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access their own notes
CREATE POLICY "Users can access their own notes"
  ON notes
  FOR ALL
  USING (auth.uid() = user_id);
```

### Step 3: Configure Environment Variables

1. Create a `.env` file in the project root (already exists in this project)
2. Add your Supabase credentials:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
EXPO_UNSTABLE_WEB_MODAL=1
```

**Note:** Variables prefixed with `EXPO_PUBLIC_` are exposed in your app bundle and are safe for client-side use. Never put secret keys (like service role keys) here.

### Step 4: Enable Authentication

In Supabase Console:

1. Go to **Auth** → **Providers**
2. Ensure **Email** provider is enabled
3. Configure email settings if needed

## Development

### Step 1: Start the Development Server

```bash
npm run dev
# or
yarn dev
```

This launches the Expo development server. You'll see a QR code in the terminal.

### Step 2: Run on Devices/Emulators

**iOS (macOS only):**

```bash
# Press 'i' in the dev server terminal
# Or use Xcode simulator
```

**Android:**

```bash
# Press 'a' in the dev server terminal
# Ensure Android emulator is running via Android Studio
```

**Web:**

```bash
# Press 'w' in the dev server terminal
```

**Physical Device:**

1. Install Expo Go app from your device's app store
2. Scan the QR code from the dev server terminal

### Step 3: Type Checking

```bash
npm run typecheck
```

Validates all TypeScript files for type errors.

### Step 4: Linting

```bash
npm run lint
```

Checks code quality and style issues.

## Project Structure

```
project/
├── app/                          # Expo Router app directory
│   ├── _layout.tsx              # Root layout wrapper
│   ├── index.tsx                # Entry point (auth flow logic)
│   ├── profile.tsx              # User profile page
│   ├── +not-found.tsx           # 404 page
│
├── components/                   # Reusable React components
│   ├── EmptyState.tsx           # Empty state UI
│   ├── NoteCard.tsx             # Individual note display
│   ├── NoteEditor.tsx           # Note editing interface
│   └── common/
│       ├── DeleteModal.tsx      # Confirmation dialog
│       └── PasswordInput.tsx    # Secure password input
│
├── pages/                        # Full-page components
│   ├── Auth.tsx                 # Authentication page (login/signup)
│   └── Home.tsx                 # Main notes list page
│
├── hooks/                        # Custom React hooks
│   ├── useAuth.tsx              # Authentication context & logic
│   ├── useFrameworkReady.ts     # Framework initialization hook
│   └── useNotes.tsx             # Notes data management
│
├── config/                       # Configuration files
│   └── supabase.ts              # Supabase client initialization
│
├── lib/                          # Utility functions
│   └── util.ts                  # Helper functions
│
├── assets/                       # Static assets
│   └── images/                  # App icons, logos
│
├── .env                          # Environment variables (IGNORED IN GIT)
├── app.json                      # Expo configuration
├── package.json                  # Dependencies & scripts
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # This file
```

## Running the Application

### Quick Start (All in One)

```bash
# Install dependencies
npm install

# Ensure .env is configured with Supabase credentials

# Start development server
npm run dev

# In another terminal, run tests if any
npm run lint
npm run typecheck
```

### Production Build

**Web:**

```bash
npm run build:web
```

Outputs optimized web bundle to `dist/` directory.

**Mobile (via EAS):**

```bash
eas build --platform ios
eas build --platform android
```

Requires EAS setup and credentials.

## Key Concepts

### Authentication Flow

1. **User Launches App** → `app/index.tsx` checks auth state
2. **No Session?** → Shows `Auth.tsx` (login/signup page)
3. **Valid Session?** → Shows `Home.tsx` (notes list)
4. **Session Changes** → UI updates automatically via `useAuth` hook

### Data Management

- **useAuth Hook**: Manages user authentication state and session
- **useNotes Hook**: Fetches and manages user's notes from Supabase
- **AsyncStorage**: Persists session data locally for offline availability

### Database Security

- **Row Level Security (RLS)** - Users can only access their own notes
- **Auth Integration** - Supabase auth guards data access

### State Management

The app uses React Context API for authentication and hooks for data fetching. No external state management library is required for this project's scope.

## Troubleshooting

### Issue: Cannot connect to Supabase

**Solution:**

- Verify `.env` file has correct `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- Check internet connectivity
- Ensure Supabase project is active

### Issue: Authentication fails

**Solution:**

- Confirm email provider is enabled in Supabase Auth settings
- Check that user email/password are correctly formatted
- Review browser console/terminal for error messages

### Issue: Notes not loading

**Solution:**

- Verify user is authenticated (check `useAuth` hook)
- Ensure `notes` table exists and RLS policies are correct
- Check Supabase realtime subscriptions status

### Issue: TypeScript errors

**Solution:**

```bash
npm run typecheck
```

Review errors and ensure all imports are correct.

### Issue: Build fails

**Solution:**

- Clear cache: `expo cache --clear`
- Remove `node_modules`: `rm -rf node_modules`
- Reinstall: `npm install`
- Rebuild: `npm run dev`

### Issue: EAS CLI not found

**Solution:**

```bash
npm install -g eas-cli
eas --version
```

## Common Commands Reference

```bash
# Development
npm run dev              # Start dev server
npm run lint             # Run linter
npm run typecheck        # Check types

# Building
npm run build:web        # Build for web
npm run build:ios        # Build for iOS (requires setup)
npm run build:android    # Build for Android (requires setup)

# Package Management
npm install              # Install dependencies
npm update               # Update dependencies
npm list                 # List all installed packages
```

## Contributing

To contribute to this project:

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Run type checking and linting: `npm run typecheck && npm run lint`
4. Commit: `git commit -am 'Add feature'`
5. Push: `git push origin feature/your-feature`
6. Create a Pull Request

## License

This project is licensed under the MIT License - see LICENSE file for details.

## Support

For issues, questions, or suggestions:

- Open an issue on the repository
- Check Supabase documentation: [docs.supabase.com](https://docs.supabase.com)
- Check Expo documentation: [docs.expo.dev](https://docs.expo.dev)
- React Native docs: [reactnative.dev](https://reactnative.dev)

---

**Happy coding! 🚀**
