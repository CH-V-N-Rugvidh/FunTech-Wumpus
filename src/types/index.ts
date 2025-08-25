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