import { useState, useCallback } from 'react';
import { Player, Question, Position } from '../types';
import { getRandomQuestion } from '../data/questions';
import { getNextOptimalMove, getRandomMove } from '../utils/pathfinding';

const GRID_SIZE = 10;
const START_POSITION: Position = { x: 0, y: 0 };
const GOAL_POSITION: Position = { x: 9, y: 9 };

export function useGameState() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [askedQuestions, setAskedQuestions] = useState<number[]>([]);
  const [gameStarted, setGameStarted] = useState(false);

  const createPlayer = useCallback((name: string) => {
    const playerId = `player-${Date.now()}-${Math.random()}`;
    const newPlayer: Player = {
      id: playerId,
      name,
      currentPosition: { ...START_POSITION },
      previousPosition: null,
      steps: 0,
      questionsAnswered: 0,
      correctAnswers: 0,
      completed: false
    };

    const updatedPlayers = [...players, newPlayer];
    setPlayers(updatedPlayers);
    setCurrentPlayer(newPlayer);
    setGameStarted(true);
    setAskedQuestions([]);
    
    // Save to localStorage for dashboard
    try {
      localStorage.setItem('funtech-wumpus-players', JSON.stringify(updatedPlayers));
    } catch (error) {
      console.error('Error saving players to storage:', error);
    }
    
    // Generate first question
    const firstQuestion = getRandomQuestion([]);
    setCurrentQuestion(firstQuestion);
    setAskedQuestions([firstQuestion.id]);
    
    return newPlayer;
  }, [players]);

  const answerQuestion = useCallback((selectedAnswer: number) => {
    if (!currentPlayer || !currentQuestion) return;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    let newPosition: Position;

    if (isCorrect) {
      // Move towards goal
      newPosition = getNextOptimalMove(currentPlayer.currentPosition, GOAL_POSITION);
    } else {
      // Random move
      newPosition = getRandomMove(currentPlayer.currentPosition, currentPlayer.previousPosition, GRID_SIZE);
    }

    const updatedPlayer: Player = {
      ...currentPlayer,
      previousPosition: { ...currentPlayer.currentPosition },
      currentPosition: newPosition,
      steps: currentPlayer.steps + 1,
      questionsAnswered: currentPlayer.questionsAnswered + 1,
      correctAnswers: currentPlayer.correctAnswers + (isCorrect ? 1 : 0),
      completed: newPosition.x === GOAL_POSITION.x && newPosition.y === GOAL_POSITION.y,
      completedAt: (newPosition.x === GOAL_POSITION.x && newPosition.y === GOAL_POSITION.y) 
        ? new Date() 
        : currentPlayer.completedAt
    };

    setCurrentPlayer(updatedPlayer);
    const updatedPlayers = players.map(p => p.id === updatedPlayer.id ? updatedPlayer : p);
    setPlayers(updatedPlayers);
    
    // Save to localStorage for dashboard
    try {
      localStorage.setItem('funtech-wumpus-players', JSON.stringify(updatedPlayers));
    } catch (error) {
      console.error('Error saving players to storage:', error);
    }

    // If game is complete, don't generate new question
    if (updatedPlayer.completed) {
      setCurrentQuestion(null);
      return;
    }

    // Generate next question after a delay
    setTimeout(() => {
      const nextQuestion = getRandomQuestion(askedQuestions);
      setCurrentQuestion(nextQuestion);
      setAskedQuestions(prev => [...prev, nextQuestion.id]);
    }, 2000);
  }, [currentPlayer, currentQuestion, askedQuestions]);

  const resetGame = useCallback(() => {
    setCurrentPlayer(null);
    setCurrentQuestion(null);
    setAskedQuestions([]);
    setGameStarted(false);
  }, []);

  const getLeaderboard = useCallback(() => {
    return players
      .filter(player => player.completed)
      .sort((a, b) => a.steps - b.steps)
      .slice(0, 10);
  }, [players]);

  return {
    players,
    currentPlayer,
    currentQuestion,
    gameStarted,
    createPlayer,
    answerQuestion,
    resetGame,
    getLeaderboard,
    startPosition: START_POSITION,
    goalPosition: GOAL_POSITION,
    gridSize: GRID_SIZE
  };
}