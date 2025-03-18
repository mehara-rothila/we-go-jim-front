# WE GO JIM - Frontend Documentation

## Overview

WE GO JIM is a modern workout tracking application built with React and Vite. The frontend provides an intuitive interface for users to monitor their fitness journey, track workouts, and analyze progress over time. The application features a dark/light theme toggle, responsive design, and comprehensive workout schedule management.

## Directory Structure

```
frontend/
├── node_modules/            # Dependencies
├── public/                  # Static assets
├── src/
│   ├── assets/              # Images, fonts, etc.
│   ├── components/
│   │   ├── common/
│   │   │   └── LoadingScreen.jsx  # Loading indicator component
│   │   ├── features/              # Feature-specific components
│   │   ├── hooks/                 # Custom React hooks
│   │   │   └── useWorkouts.js     # Hook for workout data management
│   │   ├── layout/
│   │   │   ├── Layout.jsx         # Main layout wrapper
│   │   │   ├── Navbar.jsx         # Top navigation bar
│   │   │   └── Sidebar.jsx        # Side navigation menu
│   │   ├── store/slices/
│   │   │   └── workoutSlice.js    # State management for workouts
│   │   ├── workouts/
│   │   │   └── EditScheduleModal.jsx  # Modal for editing schedules
│   │   └── stats/
│   │       ├── WeeklyPerformanceChart.jsx  # Weekly stats chart
│   │       ├── MonthlyPerformanceChart.jsx # Monthly stats chart
│   │       └── MetricCard.jsx              # Metric display card
│   ├── context/
│   │   ├── AuthContext.jsx        # Authentication context provider
│   │   └── ThemeContext.jsx       # Theme context provider
│   ├── data/
│   │   └── workoutData.js         # Static workout data
│   ├── hooks/
│   │   ├── useSchedules.js        # Hook for schedule management
│   │   └── useExercises.js        # Hook for exercise library management
│   ├── pages/
│   │   ├── Dashboard.jsx          # Dashboard page
│   │   ├── Exercises.jsx          # Exercise library page
│   │   ├── Login.jsx              # Login page
│   │   ├── Profile.jsx            # User profile page
│   │   ├── Register.jsx           # Registration page
│   │   ├── Stats.jsx              # Statistics page
│   │   └── Workouts.jsx           # Workout schedules page
│   ├── services/
│   │   └── api.js                 # API service for backend communication
│   ├── utils/                     # Utility functions
│   ├── App.css                    # Global styles
│   ├── App.jsx                    # Main application component
│   ├── index.css                  # Entry CSS file
│   └── main.jsx                   # Application entry point
└── .gitignore                     # Git ignore file
```

## Tech Stack

- **React**: UI library for building the user interface
- **Vite**: Build tool for fast development and optimized production builds
- **React Router DOM**: For client-side routing
- **Axios**: HTTP client for API communication
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Lucide React**: Icon library
- **React Hook Form**: Form handling and validation
- **React Context API**: State management
- **Recharts**: For data visualization charts

## Context Providers

### AuthContext
Manages authentication state throughout the application:
- User data storage
- Login/Register functions
- Token management
- Authentication state

```javascript
// Key functions
const register = async (name, email, password) => {...}
const login = async (email, password) => {...}
const logout = () => {...}
```

### ThemeContext
Manages the application theme (dark/light mode):
- Theme state storage
- Theme toggle functionality
- Theme persistence

```javascript
// Key functions
const toggleTheme = () => {...}
```

## Custom Hooks

### useSchedules
Centralizes workout schedule management:
- Fetching all schedules
- Adding a new schedule
- Error and loading states

```javascript
// Usage
const { schedules, loading, error, fetchSchedules, addSchedule } = useSchedules();
```

### useExercises
Manages exercise library functionality:
- Fetching exercises from the database
- Filtering and searching exercises
- Adding custom exercises

```javascript
// Usage
const { exercises, loading, error, searchExercises } = useExercises();
```

## Components

### Layout Components
- **Layout**: Main layout wrapper with Navbar and Sidebar
- **Navbar**: Top navigation bar with theme toggle and user menu
- **Sidebar**: Navigation menu for accessing different pages

### Workout Components
- **EditScheduleModal**: Modal for editing workout schedules
  - Allows editing days, exercises, sets and reps

### Stats Components
- **WeeklyPerformanceChart**: Visualizes weekly workout data
- **MonthlyPerformanceChart**: Visualizes monthly performance trends
- **MetricCard**: Displays individual performance metrics with change indicators

### Common Components
- **LoadingScreen**: Loading indicator for async operations

## Pages

### Authentication Pages
- **Login**: User login form
- **Register**: New user registration form

### Main Content Pages
- **Dashboard**: Overview of workout statistics and progress
  - Muscle group progress visualization
  - Recent workouts display
  - Key workout metrics
- **Workouts**: Manage workout schedules
  - Create, read, update, delete schedules
  - Search through schedules
- **Exercises**: Browse exercise library
  - Filter exercises by category, equipment, and difficulty
  - Search for specific exercises
  - View exercise details
  - Add custom exercises to library
- **Stats**: View detailed workout statistics
  - Weekly and monthly performance visualization
  - Comprehensive performance metrics
- **Profile**: User profile management (in development)

## Key Features

### Dynamic Exercise Library
- Automatically populated with default exercises
- Categorized by muscle groups
- Filtered by equipment type and difficulty level
- Searchable by exercise name

### Performance Analytics Dashboard
- Real-time workout statistics
- Muscle group distribution visualization
- Recent workout activity tracking
- Progress indicators with percentage changes

### Dark/Light Theme Toggle
- Persistent theme preference
- Comprehensive styling across all components
- Optimized for readability in both modes

## Authentication Flow (Frontend Implementation)

1. **Registration**:
   - User submits registration form
   - Form data is validated
   - Data is sent to backend API
   - On success, user is redirected to dashboard

2. **Login**:
   - User submits login form
   - Credentials are sent to backend API
   - On success, JWT token is stored in localStorage
   - User is redirected to dashboard

3. **Protected Routes**:
   - Routes are wrapped with authentication check
   - Unauthenticated users are redirected to login page
   - JWT token is included in API requests via interceptor

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- npm or yarn

### Installation

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Development Guidelines

### Code Style
- Follow ESLint/Prettier configurations
- Use functional components with hooks
- Implement proper error handling

### State Management
- Use React Context for global state
- Use component state for local UI state
- Use custom hooks for reusable state logic

### Performance Optimization
- Implement proper memoization (useCallback, useMemo)
- Optimize re-renders
- Lazy load components when appropriate

### API Communication
- Use the api.js service for all backend communication
- Implement proper error handling
- Use loading states for better UX

## Deployment

### Frontend Deployment
1. Build the production bundle:
```bash
npm run build
```
2. Deploy the `dist` directory to a static hosting service (Netlify, Vercel, etc.)

## Troubleshooting

### Common Issues

#### API Connection Issues
- Verify backend server is running
- Check network connectivity
- Check API base URL configuration

#### Authentication Issues
- Clear localStorage and try logging in again
- Verify token is being properly stored
- Check token expiration handling

#### Build Issues
- Clear node_modules and reinstall dependencies
- Verify compatible Node.js version
- Check for any lint or build errors

## Maintenance

### Updating Dependencies
Regularly update dependencies to maintain security and performance:
```bash
npm update
```

### Frontend Monitoring
- Implement error tracking
- Monitor application performance
- Track user engagement metrics

## Future Development Features

1. **Progress Tracking**: Visual charts showing progress over time
2. **Workout Timer**: Integrated timer for tracking workout duration
3. **Personal Records**: Track personal bests for exercises
4. **Nutrition Tracking**: Basic calorie and macronutrient tracking
5. **Social Features**: Share workouts and achievements
6. **Mobile App**: Native mobile experience

---

## License
This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

---

*Documentation last updated: March 18, 2025*