# FunTech Wumpus Quiz Game

A modern, interactive quiz game where players guide a Wumpus through a grid by answering technology questions correctly.

## Features

- **Interactive Grid Game**: Navigate the Wumpus through a 10x10 grid
- **Tech Quiz Questions**: Answer questions about emerging and general technology
- **Real-time Dashboard**: Monitor active players and leaderboards
- **Admin Panel**: Upload custom questions via CSV
- **Database Integration**: PostgreSQL for persistent data storage
- **Responsive Design**: Works on desktop and mobile devices

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

### Database Setup

1. Create a PostgreSQL database named `funtech_wumpus`
2. Update the `.env` file with your database credentials:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/funtech_wumpus
DB_HOST=localhost
DB_PORT=5432
DB_NAME=funtech_wumpus
DB_USER=your_username
DB_PASSWORD=your_password
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=3001
```

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the backend server:
```bash
npm run dev:server
```

3. In a new terminal, start the frontend:
```bash
npm run dev
```

4. Or run both simultaneously:
```bash
npm run dev:full
```

### Admin Access

The system creates 4 admin accounts automatically:

**Admin 1:**
- Username: `admin1`
- Email: `admin1@funtech.com`
- Password: `FunTech2024!Admin1`

**Admin 2:**
- Username: `admin2`
- Email: `admin2@funtech.com`
- Password: `FunTech2024!Admin2`

**Admin 3:**
- Username: `admin3`
- Email: `admin3@funtech.com`
- Password: `FunTech2024!Admin3`

**Admin 4:**
- Username: `admin4`
- Email: `admin4@funtech.com`
- Password: `FunTech2024!Admin4`

### Admin Panel

Access the admin panel at: `http://localhost:5173/admin`

Use any of the admin credentials above to:
- Upload custom questions via CSV
- Manage quiz content
- Monitor system status

### CSV Format for Questions

```csv
question,option1,option2,option3,option4,correct_answer,category,difficulty,explanation
"What does AI stand for?","Artificial Intelligence","Automated Intelligence","Advanced Intelligence","Augmented Intelligence","Artificial Intelligence","emerging-tech","easy","AI stands for Artificial Intelligence"
```

Required columns:
- `question`: The question text
- `option1-4`: Answer options
- `correct_answer`: Exact text matching one of the options
- `category`: "emerging-tech" or "general-tech"
- `difficulty`: "easy", "medium", or "hard"
- `explanation`: Optional explanation (shown for wrong answers)

## Game Rules

1. **Objective**: Guide the Wumpus from the start (0,0) to the goal (9,9)
2. **Movement**: Answer questions correctly to move optimally toward the goal
3. **Scoring**: Points based on question difficulty, distance from goal, and accuracy
4. **Wrong Answers**: Random movement and explanation display
5. **Completion**: Reach the goal position to finish the game

## Architecture

- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express
- **Database**: PostgreSQL
- **Styling**: Tailwind CSS with custom glass morphism effects
- **Authentication**: JWT for admin sessions

## API Endpoints

### Public Endpoints
- `GET /api/questions` - Get all questions
- `GET /api/players` - Get all players
- `POST /api/players` - Save/update player
- `GET /api/players/:id` - Get specific player

### Admin Endpoints (Requires Authentication)
- `POST /api/admin/login` - Admin login
- `POST /api/admin/questions` - Upload questions

### Game Session Endpoints
- `POST /api/game-sessions` - Save game session
- `GET /api/game-sessions/:id` - Get game session
- `POST /api/question-attempts` - Save question attempt

## Development

The application uses:
- Hot module replacement for fast development
- TypeScript for type safety
- ESLint for code quality
- Tailwind CSS for styling
- Custom hooks for state management

## Production Deployment

1. Build the frontend:
```bash
npm run build
```

2. Set up environment variables for production
3. Deploy the backend server
4. Serve the built frontend files
5. Configure PostgreSQL for production use

## Security Notes

- Change JWT secret in production
- Use environment variables for sensitive data
- Implement rate limiting for API endpoints
- Use HTTPS in production
- Regularly update dependencies