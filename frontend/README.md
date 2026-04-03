# Vibely Frontend

A modern React/Next.js application with shadcn/ui components, Tailwind CSS, and TypeScript.

## Features

- ✅ Next.js 14 with App Router
- ✅ TypeScript support
- ✅ Tailwind CSS for styling
- ✅ shadcn/ui component library
- ✅ Framer Motion animations
- ✅ Authentication system with React Context
- ✅ Protected routes and redirects
- ✅ Sign In & Sign Up pages with form validation
- ✅ Animated ShuffleHero component
- ✅ User dashboard and profile display
- ✅ Responsive design
- ✅ Dark mode support

## Getting Started

### Prerequisites

Make sure you have Node.js 18+ installed on your system.

### Installation

1. Navigate to the frontend directory:
```bash
cd VIBELY/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
VIBELY/frontend/
├── app/                    # Next.js App Router pages
│   ├── globals.css        # Global styles with Tailwind
│   ├── layout.tsx         # Root layout with AuthProvider
│   ├── page.tsx          # Home page (shows different content based on auth)
│   ├── hero/             # Protected hero dashboard page
│   ├── demo/             # Simple demo page
│   ├── signin/           # Sign in page with authentication
│   └── signup/           # Sign up page with authentication
├── components/
│   ├── ProtectedRoute.tsx # Route protection component
│   └── ui/               # shadcn/ui components
│       ├── button.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── shuffle-grid.tsx  # Animated hero component
│       ├── demo.tsx         # Demo wrapper
│       └── sign-up.tsx
├── contexts/
│   └── AuthContext.tsx   # Authentication context and provider
├── lib/
│   └── utils.ts          # Utility functions (cn helper)
└── package.json
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Components

### UI Components (shadcn/ui)

- **Button**: Versatile button component with multiple variants
- **Input**: Form input component with proper styling
- **Label**: Accessible label component
- **ShuffleGrid**: Animated hero component with shuffling image grid
- **Sign-up**: Custom sign-up component example

### Pages

- **Home** (`/`): Landing page that shows different content for authenticated vs non-authenticated users
- **Hero** (`/hero`): Protected dashboard page with ShuffleHero component (requires login)
- **Demo** (`/demo`): Public demo page with just the ShuffleHero component
- **Sign Up** (`/signup`): User registration form with validation and auto-redirect
- **Sign In** (`/signin`): User login form with validation and auto-redirect

## Authentication System

The app includes a complete authentication system:

### Features
- **React Context**: Centralized auth state management
- **LocalStorage**: Persistent login sessions
- **Form Validation**: Email and password validation
- **Auto Redirects**: Automatic redirects after login/signup
- **Protected Routes**: Hero page requires authentication
- **Loading States**: Proper loading indicators during auth operations

### How it Works
1. **Sign Up**: Users create account with email, password, first/last name
2. **Sign In**: Users login with email and password (minimum 6 characters)
3. **Auto Redirect**: After successful auth, users are redirected to `/hero`
4. **Protected Access**: `/hero` page requires authentication, redirects to `/signin` if not logged in
5. **Persistent Sessions**: Login state persists across browser sessions
6. **Logout**: Users can logout from navigation or homepage

### Demo Credentials
Since this is a demo app, any email and password (6+ characters) will work for testing.

## Styling

The project uses Tailwind CSS with a custom design system based on shadcn/ui. The color palette and component styles are defined in:

- `app/globals.css` - CSS variables and base styles
- `tailwind.config.ts` - Tailwind configuration
- `components/ui/*` - Component-specific styles

## Dependencies

### Core Dependencies
- `react` & `react-dom` - React framework
- `next` - Next.js framework
- `framer-motion` - Animation library for smooth transitions
- `@radix-ui/react-*` - Headless UI components
- `class-variance-authority` - Component variant management
- `clsx` & `tailwind-merge` - Utility for conditional classes

### Development Dependencies
- `typescript` - TypeScript support
- `tailwindcss` - CSS framework
- `eslint` - Code linting

## Next Steps

1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Visit the application at `http://localhost:3000`
4. Customize the components and pages as needed
5. Add authentication logic to the forms
6. Connect to your backend API