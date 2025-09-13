export interface Position {
  x: number;
  y: number;
}

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  category: 'emerging-tech' | 'general-tech';
  difficulty: 'easy' | 'medium' | 'hard';
  explanation?: string;
}

export interface Player {
  id: string;
  gameId: string;
  name: string;
  currentPosition: Position;
  previousPosition: Position | null;
  pathTaken: Position[];
  visitedPositions: Position[];
  steps: number;
  questionsAnswered: number;
  correctAnswers: number;
  completed: boolean;
  completedAt?: Date;
  askedQuestions: number[];
  score: number;
}

export interface GameSession {
  id: string;
  gameId: string;
  playerId: string;
  questionsAttempted: QuestionAttempt[];
  startedAt: Date;
  completedAt?: Date;
  finalScore: number;
  pathTaken: Position[];
  visitedPositions: Position[];
}

export interface QuestionAttempt {
  questionId: number;
  question: string;
  options: string[];
  selectedAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
  explanation?: string;
  attemptedAt: Date;
}

export interface Admin {
  id: number;
  username: string;
  email: string;
}

export interface GameState {
  currentQuestion: Question | null;
  players: Player[];
  leaderboard: Player[];
}

export interface WumpusPath {
  current: Position;
  target: Position;
  path: Position[];
}

export interface CSVQuestion {
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correct_answer: string;
  category: string;
  difficulty: string;
  explanation?: string;
}

export interface Game {
  id: string;
  status: 'waiting' | 'active' | 'ended';
  startedAt?: Date;
  endedAt?: Date;
  durationMinutes: number;
  createdBy: number;
  createdAt: Date;
}

export interface WaitingRoomPlayer {
  id: string;
  playerName: string;
  joinedAt: Date;
  gameId?: string;
}

export interface Student {
  id: number;
  username: string;
  password_hash: string;
  full_name: string;
  email?: string;
  student_id?: string;
  created_at: Date;
}

export interface CSVStudent {
  username: string;
  password: string;
  full_name: string;
  email?: string;
  student_id?: string;
}