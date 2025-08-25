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