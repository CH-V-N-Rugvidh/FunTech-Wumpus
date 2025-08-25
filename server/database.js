const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Initialize database tables
async function initializeDatabase() {
  try {
    // Create admins table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create questions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS questions (
        id SERIAL PRIMARY KEY,
        question TEXT NOT NULL,
        options JSONB NOT NULL,
        correct_answer INTEGER NOT NULL,
        category VARCHAR(50) NOT NULL,
        difficulty VARCHAR(20) NOT NULL,
        explanation TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create players table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS players (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        current_position JSONB NOT NULL,
        previous_position JSONB,
        steps INTEGER DEFAULT 0,
        questions_answered INTEGER DEFAULT 0,
        correct_answers INTEGER DEFAULT 0,
        completed BOOLEAN DEFAULT FALSE,
        completed_at TIMESTAMP,
        asked_questions JSONB DEFAULT '[]',
        score INTEGER DEFAULT 0,
        game_session_id VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create game_sessions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS game_sessions (
        id VARCHAR(100) PRIMARY KEY,
        player_id VARCHAR(100) REFERENCES players(id),
        questions_attempted JSONB DEFAULT '[]',
        started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP,
        final_score INTEGER DEFAULT 0
      )
    `);

    // Create question_attempts table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS question_attempts (
        id SERIAL PRIMARY KEY,
        session_id VARCHAR(100) REFERENCES game_sessions(id),
        question_id INTEGER REFERENCES questions(id),
        selected_answer INTEGER NOT NULL,
        is_correct BOOLEAN NOT NULL,
        attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

module.exports = { pool, initializeDatabase };