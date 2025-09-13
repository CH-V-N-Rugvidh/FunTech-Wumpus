# Overview

FunTech Wumpus Quiz Game is an interactive educational game that combines a grid-based navigation challenge with technology quiz questions. Players guide a virtual Wumpus character through a 10x10 grid by answering tech questions correctly, with real-time multiplayer support and administrative features for question management.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern component development
- **Build Tool**: Vite for fast development and optimized production builds
- **Styling**: Tailwind CSS with custom CSS variables for consistent theming and responsive design
- **State Management**: React hooks (useState, useEffect) with custom hooks for game state management
- **Component Structure**: Modular component architecture with clear separation of concerns between UI components, pages, and utilities

## Backend Architecture
- **Runtime**: Node.js with Express.js for RESTful API endpoints
- **Database**: PostgreSQL for persistent data storage with connection pooling
- **Authentication**: JWT (JSON Web Tokens) for both student and admin authentication
- **API Design**: RESTful endpoints under `/api` namespace with role-based access control
- **File Processing**: Server-side CSV parsing for bulk question and student uploads

## Game State Management
- **Real-time Updates**: Polling-based system for live dashboard updates and multiplayer synchronization
- **Local Storage**: Client-side persistence for session tokens and game progress
- **Path Finding**: Custom algorithms for optimal Wumpus movement and grid navigation
- **Question Management**: Dynamic question selection with anti-repetition logic

## Data Storage Architecture
- **Players Table**: Stores player progress, positions, scores, and completion status
- **Questions Table**: Contains quiz questions with categories, difficulties, and explanations
- **Students Table**: Manages student accounts with authentication credentials
- **Game Sessions**: Tracks individual game instances and question attempts
- **Database Migrations**: Automated schema updates for backward compatibility

## Authentication System
- **Student Authentication**: Username/password login with JWT token-based sessions
- **Admin Authentication**: Separate admin login system with elevated privileges
- **Token Management**: Secure token storage and validation with environment-based secrets
- **Session Persistence**: Local storage integration for seamless user experience

# External Dependencies

## Core Technologies
- **React 18.3.1**: Frontend framework for component-based UI development
- **Node.js/Express 5.1.0**: Backend server framework for API development
- **PostgreSQL**: Primary database for persistent data storage
- **TypeScript 5.5.3**: Type safety across both frontend and backend code

## UI and Styling
- **Tailwind CSS 3.4.1**: Utility-first CSS framework for responsive design
- **Lucide React 0.344.0**: Icon library for consistent UI iconography
- **PostCSS/Autoprefixer**: CSS processing and browser compatibility

## Backend Dependencies
- **pg 8.16.3**: PostgreSQL client for database connectivity
- **bcryptjs 3.0.2**: Password hashing for secure authentication
- **jsonwebtoken 9.0.2**: JWT implementation for session management
- **cors 2.8.5**: Cross-origin resource sharing for API access
- **dotenv 17.2.1**: Environment variable management

## Development Tools
- **Vite 5.4.2**: Fast build tool with hot module replacement
- **ESLint 9.9.1**: Code linting and quality enforcement
- **Concurrently 9.2.1**: Parallel execution of frontend and backend development servers
- **Nodemon 3.1.10**: Automatic server restart during development

## Database Configuration
- **Connection Pooling**: Efficient database connection management
- **Environment Variables**: Configurable database credentials for different environments
- **Migration System**: Automated schema updates and column additions
- **Production Safeguards**: Required credential validation in production environments