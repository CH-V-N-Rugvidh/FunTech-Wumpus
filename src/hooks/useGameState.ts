import { useState, useCallback } from 'react';
import { Player, Question, Position } from '../types';
import { getRandomQuestion } from '../data/questions';
import { getNextOptimalMove, getRandomMove, calculateDistance } from '../utils/pathfinding';

const GRID_SIZE = 10;
const START_POSITION: Position = { x: 0, y: 0 };
const GOAL_POSITION: Position = { x: 9, y: 9 };

export function useGameState() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [customQuestions, setCustomQuestions] = useState<Question[]>([]);

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
      completed: false,
      askedQuestions: [],
      score: 0
    };

    const updatedPlayers = [...players, newPlayer];
    setPlayers(updatedPlayers);
    setCurrentPlayer(newPlayer);
    setGameStarted(true);
    
    // Save to localStorage for dashboard
    try {
      localStorage.setItem('funtech-wumpus-players', JSON.stringify(updatedPlayers));
    } catch (error) {
      console.error('Error saving players to storage:', error);
    }
    
    // Generate first question
    const questionPool = customQuestions.length > 0 ? customQuestions : undefined;
    const firstQuestion = getRandomQuestion([], questionPool);
    setCurrentQuestion(firstQuestion);
    
    // Update player with first question
    const playerWithQuestion = { ...newPlayer, askedQuestions: [firstQuestion.id] };
    setCurrentPlayer(playerWithQuestion);
    const playersWithQuestion = updatedPlayers.map(p => p.id === playerId ? playerWithQuestion : p);
    setPlayers(playersWithQuestion);
    
    return newPlayer;
  }, [players, customQuestions]);

  const answerQuestion = useCallback((selectedAnswer: number) => {
    if (!currentPlayer || !currentQuestion) return;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const distanceToGoal = calculateDistance(currentPlayer.currentPosition, GOAL_POSITION);
    const baseScore = isCorrect ? 10 : 0;
    const difficultyMultiplier = currentQuestion.difficulty === 'hard' ? 3 : currentQuestion.difficulty === 'medium' ? 2 : 1;
    const distanceBonus = Math.max(0, 10 - distanceToGoal);
    const questionScore = (baseScore + distanceBonus) * difficultyMultiplier;
    
    let newPosition: Position;

    if (isCorrect) {
      // Move towards goal
      const optimalMove = getNextOptimalMove(currentPlayer.currentPosition, GOAL_POSITION);
      // 80% chance of optimal move, 20% chance of random valid move for more interesting gameplay
      if (Math.random() < 0.8) {
        newPosition = optimalMove;
      } else {
        newPosition = getRandomMove(currentPlayer.currentPosition, currentPlayer.previousPosition, GRID_SIZE);
      }
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
      score: currentPlayer.score + questionScore,
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

    // Generate next question immediately
    const questionPool = customQuestions.length > 0 ? customQuestions : undefined;
    const nextQuestion = getRandomQuestion(updatedPlayer.askedQuestions, questionPool);
    
    if (nextQuestion) {
      setCurrentQuestion(nextQuestion);
      
      // Update player's asked questions
      const playerWithNewQuestion = { 
        ...updatedPlayer, 
        askedQuestions: [...updatedPlayer.askedQuestions, nextQuestion.id] 
      };
      setCurrentPlayer(playerWithNewQuestion);
      const playersWithNewQuestion = updatedPlayers.map(p => 
        p.id === playerWithNewQuestion.id ? playerWithNewQuestion : p
      );
      setPlayers(playersWithNewQuestion);
    }
  }, [currentPlayer, currentQuestion, customQuestions, players]);

  const resetGame = useCallback(() => {
    setCurrentPlayer(null);
    setCurrentQuestion(null);
    setGameStarted(false);
  }, []);

  const getLeaderboard = useCallback(() => {
    return players
      .filter(player => player.completed)
      .sort((a, b) => {
        // Primary sort by steps (fewer is better)
        if (a.steps !== b.steps) return a.steps - b.steps;
        // Secondary sort by score (higher is better)
        return b.score - a.score;
      })
      .slice(0, 10);
  }, [players]);

  const loadCustomQuestions = useCallback((questions: Question[]) => {
    setCustomQuestions(questions);
  }, []);
  return {
    players,
    currentPlayer,
    currentQuestion,
    gameStarted,
    createPlayer,
    answerQuestion,
    resetGame,
    getLeaderboard,
    loadCustomQuestions,
    customQuestions,
    startPosition: START_POSITION,
    goalPosition: GOAL_POSITION,
    gridSize: GRID_SIZE
  };
}