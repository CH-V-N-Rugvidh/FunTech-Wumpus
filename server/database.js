const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Check if column exists
async function columnExists(tableName, columnName) {
  try {
    const result = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = $1 AND column_name = $2
    `, [tableName, columnName]);
    return result.rows.length > 0;
  } catch (error) {
    console.error('Error checking column existence:', error);
    return false;
  }
}

// Add missing columns to existing tables
async function migrateDatabase() {
  try {
    console.log('Running database migrations...');
    
    // Check and add missing columns to players table
    if (!(await columnExists('players', 'game_id'))) {
      console.log('Adding game_id column to players table...');
      await pool.query('ALTER TABLE players ADD COLUMN game_id VARCHAR(100) NOT NULL DEFAULT \'\'');
    }
    
    if (!(await columnExists('players', 'name'))) {
      console.log('Adding name column to players table...');
      await pool.query('ALTER TABLE players ADD COLUMN name VARCHAR(100) NOT NULL DEFAULT \'\'');
    }
    
    if (!(await columnExists('players', 'current_position'))) {
      console.log('Adding current_position column to players table...');
      await pool.query('ALTER TABLE players ADD COLUMN current_position JSONB NOT NULL DEFAULT \'{}\'');
    }
    
    if (!(await columnExists('players', 'previous_position'))) {
      console.log('Adding previous_position column to players table...');
      await pool.query('ALTER TABLE players ADD COLUMN previous_position JSONB');
    }
    
    if (!(await columnExists('players', 'path_taken'))) {
      console.log('Adding path_taken column to players table...');
      await pool.query('ALTER TABLE players ADD COLUMN path_taken JSONB DEFAULT \'[]\'');
    }
    
    if (!(await columnExists('players', 'visited_positions'))) {
      console.log('Adding visited_positions column to players table...');
      await pool.query('ALTER TABLE players ADD COLUMN visited_positions JSONB DEFAULT \'[]\'');
    }
    
    if (!(await columnExists('players', 'steps'))) {
      console.log('Adding steps column to players table...');
      await pool.query('ALTER TABLE players ADD COLUMN steps INTEGER DEFAULT 0');
    }
    
    if (!(await columnExists('players', 'questions_answered'))) {
      console.log('Adding questions_answered column to players table...');
      await pool.query('ALTER TABLE players ADD COLUMN questions_answered INTEGER DEFAULT 0');
    }
    
    if (!(await columnExists('players', 'correct_answers'))) {
      console.log('Adding correct_answers column to players table...');
      await pool.query('ALTER TABLE players ADD COLUMN correct_answers INTEGER DEFAULT 0');
    }
    
    if (!(await columnExists('players', 'completed'))) {
      console.log('Adding completed column to players table...');
      await pool.query('ALTER TABLE players ADD COLUMN completed BOOLEAN DEFAULT FALSE');
    }
    
    if (!(await columnExists('players', 'completed_at'))) {
      console.log('Adding completed_at column to players table...');
      await pool.query('ALTER TABLE players ADD COLUMN completed_at TIMESTAMP');
    }
    
    if (!(await columnExists('players', 'asked_questions'))) {
      console.log('Adding asked_questions column to players table...');
      await pool.query('ALTER TABLE players ADD COLUMN asked_questions JSONB DEFAULT \'[]\'');
    }
    
    if (!(await columnExists('players', 'score'))) {
      console.log('Adding score column to players table...');
      await pool.query('ALTER TABLE players ADD COLUMN score INTEGER DEFAULT 0');
    }
    
    if (!(await columnExists('players', 'game_session_id'))) {
      console.log('Adding game_session_id column to players table...');
      await pool.query('ALTER TABLE players ADD COLUMN game_session_id VARCHAR(100)');
    }
    
    if (!(await columnExists('players', 'created_at'))) {
      console.log('Adding created_at column to players table...');
      await pool.query('ALTER TABLE players ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
    }
    
    if (!(await columnExists('players', 'updated_at'))) {
      console.log('Adding updated_at column to players table...');
      await pool.query('ALTER TABLE players ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
    }
    
    console.log('Database migrations completed successfully');
  } catch (error) {
    console.error('Error during database migration:', error);
  }
}

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
        game_id VARCHAR(100) NOT NULL,
        name VARCHAR(100) NOT NULL,
        current_position JSONB NOT NULL,
        previous_position JSONB,
        path_taken JSONB DEFAULT '[]',
        visited_positions JSONB DEFAULT '[]',
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
        game_id VARCHAR(100) NOT NULL,
        player_id VARCHAR(100),
        questions_attempted JSONB DEFAULT '[]',
        started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP,
        final_score INTEGER DEFAULT 0,
        path_taken JSONB DEFAULT '[]',
        visited_positions JSONB DEFAULT '[]'
      )
    `);

    // Create games table for managing game instances
    await pool.query(`
      CREATE TABLE IF NOT EXISTS games (
        id VARCHAR(100) PRIMARY KEY,
        status VARCHAR(20) DEFAULT 'waiting',
        started_at TIMESTAMP,
        ended_at TIMESTAMP,
        duration_minutes INTEGER DEFAULT 15,
        created_by INTEGER REFERENCES admins(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create waiting_room table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS waiting_room (
        id VARCHAR(100) PRIMARY KEY,
        player_name VARCHAR(100) NOT NULL,
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        game_id VARCHAR(100)
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

    // Create students table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(100),
        student_id VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Database tables initialized successfully');
    
    // Run migrations to add any missing columns
    await migrateDatabase();
    
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

module.exports = { pool, initializeDatabase };