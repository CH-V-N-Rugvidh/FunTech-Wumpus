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
  name: string;
  currentPosition: Position;
  previousPosition: Position | null;
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
  playerId: string;
  questionsAttempted: QuestionAttempt[];
  startedAt: Date;
  completedAt?: Date;
  finalScore: number;
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