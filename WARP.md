# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a full-stack application combining news aggregation and note-taking functionality. The project consists of:
- **Frontend**: React.js application (main project) using Create React App
- **Backend**: Express.js API server with MongoDB integration
- **Legacy**: inotebook_01 subdirectory contains an older version of the notebook functionality

The application is deployed to GitHub Pages and branded as "NewsBoard/NewsMonkey" for the news functionality and "iNotebook" for the note-taking features.

## Development Commands

### Frontend (Main Project)
```bash
# Install dependencies
npm install

# Start development server (http://localhost:3000)
npm start

# Run tests
npm test

# Run tests for specific file
npm test -- --testPathPattern=App.test.js

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

### Backend Development
```bash
# Navigate to backend directory
cd Backend

# Install backend dependencies
npm install

# Start backend server (http://localhost:5000)
npm run dev

# Start production server
npm start
```

## Architecture & Structure

### Frontend Architecture
- **Context Pattern**: Uses React Context (`AuthContext`) for authentication state management
- **Router**: React Router Dom v6 for client-side routing with category-based news sections
- **Components**: Functional and class components mixed (News uses class component, others are functional)
- **Authentication**: JWT token-based auth with localStorage persistence
- **News Integration**: Uses GNews API for fetching categorized news articles
- **Infinite Scroll**: Implements react-infinite-scroll-component for news pagination

### Backend Architecture
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based authentication with custom middleware (`fetchuser.js`)
- **Models**: 
  - User model (name, email, password, date)
  - Note model (enhanced with categories, priorities, attachments, reminders)
- **API Structure**: RESTful API with `/api/auth` and `/api/notes` endpoints
- **CORS**: Enabled for cross-origin requests from frontend

### Key Integration Points
- Frontend connects to backend at `http://localhost:5000`
- Authentication token stored in localStorage as "token"
- Auth header format: "auth-token" (not standard "Authorization")
- MongoDB connection string hardcoded in `Backend/db.js` (contains credentials)

### Database Schema
- **Notes**: Enhanced schema with categories (general, work, personal, important, ideas, meeting), priorities (low, medium, high), attachments, and reminder system
- **User-Note Relationship**: Notes are linked to users via ObjectId reference

## Development Workflow

### Running Full Stack Locally
1. Start MongoDB connection (ensure MongoDB Atlas is accessible)
2. Start backend: `cd Backend && npm run dev`
3. Start frontend: `npm start` (from root)
4. Backend runs on port 5000, frontend on port 3000

### Key Environment Considerations
- Backend expects MongoDB Atlas connection (credentials in db.js)
- News API uses demo key from GNews.io
- JWT secret hardcoded as "ShakibisagoodboY@" in middleware

### Missing Backend Routes
Note: The backend index.js references router files (`./router/auth` and `./router/notes`) that don't exist in the current codebase. These would need to be created for full functionality.

## Testing
- Uses React Testing Library and Jest
- Test files follow `*.test.js` pattern
- Main test file: `src/App.test.js`
