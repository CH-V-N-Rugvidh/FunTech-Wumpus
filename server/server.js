const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool, initializeDatabase } = require('./database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
// Enforce JWT_SECRET in production
const JWT_SECRET = process.env.JWT_SECRET || (process.env.NODE_ENV === 'production' ? 
  (() => { throw new Error('JWT_SECRET must be set in production') })() : 
  'fallback-dev-secret-change-in-production');

// Configure CORS based on environment
if (process.env.NODE_ENV === 'production') {
  // In production, disable CORS since we serve SPA and API from the same origin
  // If you need to allow specific origins, set APP_ORIGIN environment variable
  if (process.env.APP_ORIGIN) {
    app.use(cors({
      origin: process.env.APP_ORIGIN,
      credentials: false
    }));
  }
  // Otherwise, no CORS middleware (same-origin only)
} else {
  app.use(cors()); // Allow all origins in development
}
app.use(express.json());

// Serve static files from the built frontend in production
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  app.use(express.static(path.join(__dirname, '..', 'dist')));
  
  // Handle client-side routing for SPA
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next(); // Skip static file handling for API routes
    }
    res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
  });
}

// Hardcoded admin credentials for initial setup
const HARDCODED_ADMINS = [
  { 
    username: 'admin1', 
    email: 'admin1@funtech.com', 
    password: 'AdminPass123!' 
  },
  { 
    username: 'admin2', 
    email: 'admin2@funtech.com', 
    password: 'AdminPass456!' 
  },
  { 
    username: 'admin3', 
    email: 'admin3@funtech.com', 
    password: 'AdminPass789!' 
  },
  { 
    username: 'admin4', 
    email: 'admin4@funtech.com', 
    password: 'AdminPass012!' 
  }
];

// Get admin credentials based on environment
function getAdminCredentials() {
  if (process.env.NODE_ENV === 'production') {
    // In production, use environment variables if provided, otherwise use hardcoded
    return [{
      username: process.env.ADMIN_USERNAME || 'admin1',
      email: process.env.ADMIN_EMAIL || 'admin1@funtech.com',
      password: process.env.ADMIN_PASSWORD || 'AdminPass123!'
    }];
  } else {
    // In development, use hardcoded credentials
    return HARDCODED_ADMINS;
  }
}

// Middleware to verify admin token (moved to top)
const verifyAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const admin = await pool.query('SELECT * FROM admins WHERE id = $1', [decoded.adminId]);
    
    if (admin.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.admin = admin.rows[0];
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Middleware to verify student token
const verifyStudent = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const student = await pool.query('SELECT * FROM students WHERE id = $1', [decoded.studentId]);
    
    if (student.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.student = student.rows[0];
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Create admin accounts - called after database initialization
async function createAdminAccounts() {
  try {
    console.log('Creating/verifying admin accounts...');
    
    // Check if any admin accounts exist
    const existingAdmins = await pool.query('SELECT COUNT(*) as count FROM admins');
    const adminCount = parseInt(existingAdmins.rows[0].count);
    
    if (adminCount === 0) {
      console.log('No admin accounts found. Creating hardcoded admin accounts...');
      const adminCredentials = getAdminCredentials();
      
      for (const admin of adminCredentials) {
        const hashedPassword = await bcrypt.hash(admin.password, 10);
        await pool.query(
          'INSERT INTO admins (username, email, password_hash) VALUES ($1, $2, $3)',
          [admin.username, admin.email, hashedPassword]
        );
        console.log(`Created admin account: ${admin.username}`);
      }
      
      console.log('Admin accounts created successfully');
      console.log('Default admin credentials:');
      adminCredentials.forEach(admin => {
        console.log(`Username: ${admin.username}, Password: ${admin.password}`);
      });
    } else {
      console.log(`Found ${adminCount} existing admin account(s)`);
      
      // In production, still update the main admin account if env vars are provided
      if (process.env.NODE_ENV === 'production' && process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD) {
        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
        await pool.query(
          'INSERT INTO admins (username, email, password_hash) VALUES ($1, $2, $3) ON CONFLICT (username) DO UPDATE SET password_hash = $3, email = $2',
          [process.env.ADMIN_USERNAME, process.env.ADMIN_EMAIL || 'admin@funtech.com', hashedPassword]
        );
        console.log('Production admin account updated from environment variables');
      }
    }
  } catch (error) {
    console.error('Error creating admin accounts:', error);
    if (process.env.NODE_ENV === 'production') {
      throw error; // Fail fast in production
    }
  }
}

// Initialize database and create admin accounts
async function initializeApp() {
  try {
    await initializeDatabase();
    await createAdminAccounts();
  } catch (error) {
    console.error('Error initializing application:', error);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1); // Exit in production on critical errors
    }
  }
}

// Initialize the app
initializeApp();

// Student authentication endpoints

// Student login
app.post('/api/student/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const student = await pool.query('SELECT * FROM students WHERE username = $1', [username]);
    if (student.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, student.rows[0].password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ studentId: student.rows[0].id }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ 
      token, 
      student: { 
        id: student.rows[0].id, 
        username: student.rows[0].username, 
        fullName: student.rows[0].full_name,
        email: student.rows[0].email,
        studentId: student.rows[0].student_id
      } 
    });
  } catch (error) {
    console.error('Student login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin student management endpoints

// Upload students (admin only)
app.post('/api/admin/students', verifyAdmin, async (req, res) => {
  try {
    const { students } = req.body;
    
    let successCount = 0;
    let errorCount = 0;
    const errors = [];
    
    for (const student of students) {
      try {
        const hashedPassword = await bcrypt.hash(student.password, 10);
        await pool.query(
          'INSERT INTO students (username, password_hash, full_name, email, student_id) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (username) DO UPDATE SET password_hash = $2, full_name = $3, email = $4, student_id = $5',
          [student.username, hashedPassword, student.full_name, student.email, student.student_id]
        );
        successCount++;
      } catch (error) {
        errorCount++;
        errors.push(`Error with student ${student.username}: ${error.message}`);
      }
    }
    
    res.json({ 
      message: `Students processed: ${successCount} successful, ${errorCount} errors`,
      successCount,
      errorCount,
      errors: errors.slice(0, 10) // Limit error messages
    });
  } catch (error) {
    console.error('Error uploading students:', error);
    res.status(500).json({ error: 'Failed to upload students' });
  }
});

// Get all students (admin only)
app.get('/api/admin/students', verifyAdmin, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, username, full_name, email, student_id, created_at FROM students ORDER BY full_name');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// Game management endpoints

// Create new game
app.post('/api/admin/games', verifyAdmin, async (req, res) => {
  try {
    const gameId = `game-${Date.now()}-${Math.random()}`;
    await pool.query(
      'INSERT INTO games (id, created_by) VALUES ($1, $2)',
      [gameId, req.admin.id]
    );
    res.json({ gameId, message: 'Game created successfully' });
  } catch (error) {
    console.error('Error creating game:', error);
    res.status(500).json({ error: 'Failed to create game' });
  }
});

// Start game
app.post('/api/admin/games/:gameId/start', verifyAdmin, async (req, res) => {
  try {
    const { gameId } = req.params;
    
    // Update game status
    await pool.query(
      'UPDATE games SET status = $1, started_at = CURRENT_TIMESTAMP WHERE id = $2',
      ['active', gameId]
    );
    
    // Move waiting room players to active players
    const waitingPlayers = await pool.query(
      'SELECT * FROM waiting_room WHERE game_id = $1 OR game_id IS NULL',
      [gameId]
    );
    
    for (const waitingPlayer of waitingPlayers.rows) {
      const playerId = `player-${Date.now()}-${Math.random()}`;
      const sessionId = `session-${Date.now()}-${Math.random()}`;
      
      await pool.query(`
        INSERT INTO players (id, game_id, name, current_position, previous_position, path_taken, visited_positions, game_session_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [
        playerId, gameId, waitingPlayer.player_name, 
        JSON.stringify({ x: 0, y: 0 }), null,
        JSON.stringify([{ x: 0, y: 0 }]),
        JSON.stringify([{ x: 0, y: 0 }]),
        sessionId
      ]);
      
      await pool.query(`
        INSERT INTO game_sessions (id, game_id, player_id, path_taken, visited_positions)
        VALUES ($1, $2, $3, $4, $5)
      `, [sessionId, gameId, playerId, JSON.stringify([{ x: 0, y: 0 }]), JSON.stringify([{ x: 0, y: 0 }])]);
    }
    
    // Clear waiting room
    await pool.query('DELETE FROM waiting_room WHERE game_id = $1 OR game_id IS NULL', [gameId]);
    
    res.json({ message: 'Game started successfully' });
  } catch (error) {
    console.error('Error starting game:', error);
    res.status(500).json({ error: 'Failed to start game' });
  }
});

// End game
app.post('/api/admin/games/:gameId/end', verifyAdmin, async (req, res) => {
  try {
    const { gameId } = req.params;
    
    await pool.query(
      'UPDATE games SET status = $1, ended_at = CURRENT_TIMESTAMP WHERE id = $2',
      ['ended', gameId]
    );
    
    res.json({ message: 'Game ended successfully' });
  } catch (error) {
    console.error('Error ending game:', error);
    res.status(500).json({ error: 'Failed to end game' });
  }
});

// Get current game status
app.get('/api/games/current', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM games WHERE status IN ($1, $2) ORDER BY created_at DESC LIMIT 1',
      ['waiting', 'active']
    );
    
    if (result.rows.length === 0) {
      return res.json({ game: null });
    }
    
    const game = result.rows[0];
    res.json({ game });
  } catch (error) {
    console.error('Error fetching current game:', error);
    res.status(500).json({ error: 'Failed to fetch current game' });
  }
});

// Join waiting room
app.post('/api/waiting-room/join', async (req, res) => {
  try {
    const { playerName } = req.body;
    const playerId = `waiting-${Date.now()}-${Math.random()}`;
    
    // Get current waiting game
    const gameResult = await pool.query(
      'SELECT id FROM games WHERE status = $1 ORDER BY created_at DESC LIMIT 1',
      ['waiting']
    );
    
    const gameId = gameResult.rows.length > 0 ? gameResult.rows[0].id : null;
    
    await pool.query(
      'INSERT INTO waiting_room (id, player_name, game_id) VALUES ($1, $2, $3)',
      [playerId, playerName, gameId]
    );
    
    res.json({ playerId, message: 'Joined waiting room successfully' });
  } catch (error) {
    console.error('Error joining waiting room:', error);
    res.status(500).json({ error: 'Failed to join waiting room' });
  }
});

// Leave waiting room
app.delete('/api/waiting-room/:playerId', async (req, res) => {
  try {
    const { playerId } = req.params;
    await pool.query('DELETE FROM waiting_room WHERE id = $1', [playerId]);
    res.json({ message: 'Left waiting room successfully' });
  } catch (error) {
    console.error('Error leaving waiting room:', error);
    res.status(500).json({ error: 'Failed to leave waiting room' });
  }
});

// Get waiting room players
app.get('/api/waiting-room', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM waiting_room ORDER BY joined_at ASC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching waiting room:', error);
    res.status(500).json({ error: 'Failed to fetch waiting room' });
  }
});

// Download game data
app.get('/api/admin/games/:gameId/download', verifyAdmin, async (req, res) => {
  try {
    const { gameId } = req.params;
    
    const gameData = await pool.query('SELECT * FROM games WHERE id = $1', [gameId]);
    const players = await pool.query('SELECT * FROM players WHERE game_id = $1', [gameId]);
    const sessions = await pool.query('SELECT * FROM game_sessions WHERE game_id = $1', [gameId]);
    const attempts = await pool.query(`
      SELECT qa.*, gs.player_id 
      FROM question_attempts qa 
      JOIN game_sessions gs ON qa.session_id = gs.id 
      WHERE gs.game_id = $1
    `, [gameId]);
    
    const data = {
      game: gameData.rows[0],
      players: players.rows,
      sessions: sessions.rows,
      questionAttempts: attempts.rows
    };
    
    res.json(data);
  } catch (error) {
    console.error('Error downloading game data:', error);
    res.status(500).json({ error: 'Failed to download game data' });
  }
});

// Admin login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const admin = await pool.query('SELECT * FROM admins WHERE username = $1', [username]);
    if (admin.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, admin.rows[0].password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ adminId: admin.rows[0].id }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, admin: { id: admin.rows[0].id, username: admin.rows[0].username, email: admin.rows[0].email } });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Upload questions (admin only) - Fixed to handle foreign key constraints
app.post('/api/admin/questions', verifyAdmin, async (req, res) => {
  const client = await pool.connect();
  try {
    const { questions } = req.body;
    
    // Start transaction
    await client.query('BEGIN');
    
    // First, delete all question attempts (to avoid foreign key constraint)
    await client.query('DELETE FROM question_attempts');
    
    // Then delete all questions
    await client.query('DELETE FROM questions');
    
    // Reset the sequence for question IDs to start from 1
    await client.query('ALTER SEQUENCE questions_id_seq RESTART WITH 1');
    
    // Insert new questions
    for (const question of questions) {
      await client.query(
        'INSERT INTO questions (question, options, correct_answer, category, difficulty, explanation) VALUES ($1, $2, $3, $4, $5, $6)',
        [question.question, JSON.stringify(question.options), question.correctAnswer, question.category, question.difficulty, question.explanation]
      );
    }
    
    // Commit transaction
    await client.query('COMMIT');
    
    res.json({ 
      message: 'Questions uploaded successfully', 
      count: questions.length,
      warning: 'All previous question attempts have been cleared due to question update.'
    });
  } catch (error) {
    // Rollback transaction on error
    await client.query('ROLLBACK');
    console.error('Error uploading questions:', error);
    res.status(500).json({ error: 'Failed to upload questions' });
  } finally {
    client.release();
  }
});

// Get questions for game
app.get('/api/questions', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM questions ORDER BY id');
    const questions = result.rows.map(row => ({
      id: row.id,
      question: row.question,
      options: row.options,
      correctAnswer: row.correct_answer,
      category: row.category,
      difficulty: row.difficulty,
      explanation: row.explanation
    }));
    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

// Save/Update player
app.post('/api/players', async (req, res) => {
  try {
    const player = req.body;
    
    await pool.query(`
      INSERT INTO players (id, game_id, name, current_position, previous_position, path_taken, visited_positions, steps, questions_answered, correct_answers, completed, completed_at, asked_questions, score, game_session_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      ON CONFLICT (id) DO UPDATE SET
        current_position = $4,
        previous_position = $5,
        path_taken = $6,
        visited_positions = $7,
        steps = $8,
        questions_answered = $9,
        correct_answers = $10,
        completed = $11,
        completed_at = $12,
        asked_questions = $13,
        score = $14,
        updated_at = CURRENT_TIMESTAMP
    `, [
      player.id, player.gameId, player.name, JSON.stringify(player.currentPosition), 
      JSON.stringify(player.previousPosition), JSON.stringify(player.pathTaken), 
      JSON.stringify(player.visitedPositions), player.steps, player.questionsAnswered,
      player.correctAnswers, player.completed, player.completedAt, 
      JSON.stringify(player.askedQuestions), player.score, player.gameSessionId
    ]);
    
    res.json({ message: 'Player saved successfully' });
  } catch (error) {
    console.error('Error saving player:', error);
    res.status(500).json({ error: 'Failed to save player' });
  }
});

// Get player by ID
app.get('/api/players/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM players WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Player not found' });
    }
    
    const row = result.rows[0];
    const player = {
      id: row.id,
      gameId: row.game_id,
      name: row.name,
      currentPosition: row.current_position,
      previousPosition: row.previous_position,
      pathTaken: row.path_taken,
      visitedPositions: row.visited_positions,
      steps: row.steps,
      questionsAnswered: row.questions_answered,
      correctAnswers: row.correct_answers,
      completed: row.completed,
      completedAt: row.completed_at,
      askedQuestions: row.asked_questions,
      score: row.score,
      gameSessionId: row.game_session_id
    };
    
    res.json(player);
  } catch (error) {
    console.error('Error fetching player:', error);
    res.status(500).json({ error: 'Failed to fetch player' });
  }
});

// Get all players (without gameId filter)
app.get('/api/players', async (req, res) => {
  try {
    const query = 'SELECT * FROM players ORDER BY created_at DESC';
    
    const result = await pool.query(query);
    const players = result.rows.map(row => ({
      id: row.id,
      gameId: row.game_id,
      name: row.name,
      currentPosition: row.current_position,
      previousPosition: row.previous_position,
      pathTaken: row.path_taken,
      visitedPositions: row.visited_positions,
      steps: row.steps,
      questionsAnswered: row.questions_answered,
      correctAnswers: row.correct_answers,
      completed: row.completed,
      completedAt: row.completed_at,
      askedQuestions: row.asked_questions,
      score: row.score,
      gameSessionId: row.game_session_id
    }));
    res.json(players);
  } catch (error) {
    console.error('Error fetching players:', error);
    res.status(500).json({ error: 'Failed to fetch players' });
  }
});

// Get all games (admin only)
app.get('/api/admin/games', verifyAdmin, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT g.*, COUNT(p.id) as player_count 
      FROM games g 
      LEFT JOIN players p ON g.id = p.game_id 
      GROUP BY g.id 
      ORDER BY g.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ error: 'Failed to fetch games' });
  }
});

// Download all game sessions (admin only)
app.get('/api/admin/game-sessions/download', verifyAdmin, async (req, res) => {
  try {
    const sessions = await pool.query(`
      SELECT gs.*, p.name as player_name, g.created_at as game_created_at
      FROM game_sessions gs
      JOIN players p ON gs.player_id = p.id
      JOIN games g ON gs.game_id = g.id
      ORDER BY gs.started_at DESC
    `);
    
    const csvData = sessions.rows.map(session => ({
      game_id: session.game_id,
      game_created_at: session.game_created_at,
      session_id: session.id,
      player_name: session.player_name,
      started_at: session.started_at,
      completed_at: session.completed_at,
      final_score: session.final_score,
      questions_attempted: session.questions_attempted ? session.questions_attempted.length : 0
    }));
    
    res.json(csvData);
  } catch (error) {
    console.error('Error downloading game sessions:', error);
    res.status(500).json({ error: 'Failed to download game sessions' });
  }
});

// Download game leaderboard (admin only)
app.get('/api/admin/games/:gameId/leaderboard', verifyAdmin, async (req, res) => {
  try {
    const { gameId } = req.params;
    
    const players = await pool.query(`
      SELECT * FROM players 
      WHERE game_id = $1 AND completed = true 
      ORDER BY steps ASC, completed_at ASC, score DESC
    `, [gameId]);
    
    const leaderboardData = players.rows.map((player, index) => ({
      rank: index + 1,
      player_name: player.name,
      steps: player.steps,
      questions_answered: player.questions_answered,
      correct_answers: player.correct_answers,
      accuracy: player.questions_answered > 0 ? Math.round((player.correct_answers / player.questions_answered) * 100) : 0,
      score: player.score,
      completed_at: player.completed_at
    }));
    
    res.json(leaderboardData);
  } catch (error) {
    console.error('Error downloading leaderboard:', error);
    res.status(500).json({ error: 'Failed to download leaderboard' });
  }
});

// Get players by gameId
app.get('/api/players/game/:gameId', async (req, res) => {
  try {
    const { gameId } = req.params;
    const query = 'SELECT * FROM players WHERE game_id = $1 ORDER BY created_at DESC';
    
    const result = await pool.query(query, [gameId]);
    const players = result.rows.map(row => ({
      id: row.id,
      gameId: row.game_id,
      name: row.name,
      currentPosition: row.current_position,
      previousPosition: row.previous_position,
      pathTaken: row.path_taken,
      visitedPositions: row.visited_positions,
      steps: row.steps,
      questionsAnswered: row.questions_answered,
      correctAnswers: row.correct_answers,
      completed: row.completed,
      completedAt: row.completed_at,
      askedQuestions: row.asked_questions,
      score: row.score,
      gameSessionId: row.game_session_id
    }));
    res.json(players);
  } catch (error) {
    console.error('Error fetching players:', error);
    res.status(500).json({ error: 'Failed to fetch players' });
  }
});

// Save game session
app.post('/api/game-sessions', async (req, res) => {
  try {
    const { id, gameId, playerId, questionsAttempted, completedAt, finalScore, pathTaken, visitedPositions } = req.body;
    
    await pool.query(`
      INSERT INTO game_sessions (id, game_id, player_id, questions_attempted, completed_at, final_score, path_taken, visited_positions)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (id) DO UPDATE SET
        questions_attempted = $4,
        completed_at = $5,
        final_score = $6,
        path_taken = $7,
        visited_positions = $8
    `, [id, gameId, playerId, JSON.stringify(questionsAttempted), completedAt, finalScore, JSON.stringify(pathTaken), JSON.stringify(visitedPositions)]);
    
    res.json({ message: 'Game session saved successfully' });
  } catch (error) {
    console.error('Error saving game session:', error);
    res.status(500).json({ error: 'Failed to save game session' });
  }
});

// Get game session
app.get('/api/game-sessions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM game_sessions WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Game session not found' });
    }
    
    const row = result.rows[0];
    const session = {
      id: row.id,
      gameId: row.game_id,
      playerId: row.player_id,
      questionsAttempted: row.questions_attempted,
      startedAt: row.started_at,
      completedAt: row.completed_at,
      finalScore: row.final_score,
      pathTaken: row.path_taken,
      visitedPositions: row.visited_positions
    };
    
    res.json(session);
  } catch (error) {
    console.error('Error fetching game session:', error);
    res.status(500).json({ error: 'Failed to fetch game session' });
  }
});

// Save question attempt
app.post('/api/question-attempts', async (req, res) => {
  try {
    const { sessionId, questionId, selectedAnswer, isCorrect } = req.body;
    
    await pool.query(
      'INSERT INTO question_attempts (session_id, question_id, selected_answer, is_correct) VALUES ($1, $2, $3, $4)',
      [sessionId, questionId, selectedAnswer, isCorrect]
    );
    
    res.json({ message: 'Question attempt saved successfully' });
  } catch (error) {
    console.error('Error saving question attempt:', error);
    res.status(500).json({ error: 'Failed to save question attempt' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Visit the application at http://localhost:${PORT}`);
  }
});