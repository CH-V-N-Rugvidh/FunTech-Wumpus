import { useState, useCallback } from 'react';
import { Player, Question, Position, GameSession, QuestionAttempt } from '../types';
import { gameApi } from '../services/api';
import { getNextOptimalMove, getRandomMove, calculateDistance } from '../utils/pathfinding';
import React from 'react';

const GRID_SIZE = 10;
const START_POSITION: Position = { x: 0, y: 0 };
const GOAL_POSITION: Position = { x: 9, y: 9 };

export function useGameState() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  const [questionAttempts, setQuestionAttempts] = useState<QuestionAttempt[]>([]);

  // Load questions from database
  const loadQuestions = useCallback(async () => {
    try {
      const dbQuestions = await gameApi.getQuestions();
      setQuestions(dbQuestions);
    } catch (error) {
      console.error('Error loading questions:', error);
      // Fallback to default questions if database fails
      const { techQuestions } = await import('../data/questions');
      setQuestions(techQuestions);
    }
  }, []);

  // Load players from database
  const loadPlayers = useCallback(async () => {
    try {
      const dbPlayers = await gameApi.getAllPlayers();
      setPlayers(dbPlayers);
    } catch (error) {
      console.error('Error loading players:', error);
    }
  }, []);

  // Initialize data on first load
  React.useEffect(() => {
    loadQuestions();
    loadPlayers();
  }, [loadQuestions, loadPlayers]);

  // Get random question
  const getRandomQuestion = useCallback((excludeIds: number[] = []): Question | null => {
    const availableQuestions = questions.filter(q => !excludeIds.includes(q.id));
    
    if (availableQuestions.length === 0) {
      return questions.length > 0 ? questions[Math.floor(Math.random() * questions.length)] : null;
    }
    
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    const question = { ...availableQuestions[randomIndex] };
    
    // Shuffle options
    const shuffledOptions = [...question.options];
    const correctOption = shuffledOptions[question.correctAnswer];
    
    for (let i = shuffledOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
    }
    
    question.options = shuffledOptions;
    question.correctAnswer = shuffledOptions.indexOf(correctOption);
    
    return question;
  }, [questions]);

  const createPlayer = useCallback((name: string) => {
    if (questions.length === 0) {
      console.error('No questions available');
      return null;
    }

    const playerId = `player-${Date.now()}-${Math.random()}`;
    const sessionId = `session-${Date.now()}-${Math.random()}`;
    
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
      score: 0,
      gameSessionId: sessionId
    };

    const updatedPlayers = [...players, newPlayer];
    setPlayers(updatedPlayers);
    setCurrentPlayer(newPlayer);
    setGameStarted(true);
    setQuestionAttempts([]);
    
    // Create game session
    const newGameSession: GameSession = {
      id: sessionId,
      playerId,
      questionsAttempted: [],
      startedAt: new Date(),
      finalScore: 0
    };
    setGameSession(newGameSession);
    
    // Save to database
    try {
      gameApi.savePlayer(newPlayer);
      gameApi.saveGameSession(newGameSession);
    } catch (error) {
      console.error('Error saving to database:', error);
    }
    
    // Generate first question
    const firstQuestion = getRandomQuestion([]);
    if (firstQuestion) {
      setCurrentQuestion(firstQuestion);
      
      // Update player with first question
      const playerWithQuestion = { ...newPlayer, askedQuestions: [firstQuestion.id] };
      setCurrentPlayer(playerWithQuestion);
      const playersWithQuestion = updatedPlayers.map(p => p.id === playerId ? playerWithQuestion : p);
      setPlayers(playersWithQuestion);
    }
    
    return newPlayer;
  }, [players, questions, getRandomQuestion]);

  const answerQuestion = useCallback(async (selectedAnswer: number) => {
    if (!currentPlayer || !currentQuestion || !gameSession) return;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const distanceToGoal = calculateDistance(currentPlayer.currentPosition, GOAL_POSITION);
    const baseScore = isCorrect ? 10 : 0;
    const difficultyMultiplier = currentQuestion.difficulty === 'hard' ? 3 : currentQuestion.difficulty === 'medium' ? 2 : 1;
    const distanceBonus = Math.max(0, 10 - distanceToGoal);
    const questionScore = (baseScore + distanceBonus) * difficultyMultiplier;
    
    // Create question attempt record
    const attempt: QuestionAttempt = {
      questionId: currentQuestion.id,
      question: currentQuestion.question,
      options: currentQuestion.options,
      selectedAnswer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect,
      explanation: currentQuestion.explanation,
      attemptedAt: new Date()
    };
    setQuestionAttempts(prev => [...prev, attempt]);
    
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
    
    // Update game session
    const updatedSession = {
      ...gameSession,
      questionsAttempted: [...questionAttempts, attempt],
      finalScore: updatedPlayer.score,
      ...(updatedPlayer.completed && { completedAt: new Date() })
    };
    setGameSession(updatedSession);
    
    // Save to database
    try {
      await gameApi.savePlayer(updatedPlayer);
      await gameApi.saveGameSession(updatedSession);
      await gameApi.saveQuestionAttempt({
        sessionId: gameSession.id,
        questionId: currentQuestion.id,
        selectedAnswer,
        isCorrect
      });
    } catch (error) {
      console.error('Error saving to database:', error);
    }

    // If game is complete, don't generate new question
    if (updatedPlayer.completed) {
      setCurrentQuestion(null);
      return;
    }

    // Generate next question immediately
    const nextQuestion = getRandomQuestion(updatedPlayer.askedQuestions);
    
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
  }, [currentPlayer, currentQuestion, gameSession, questionAttempts, players, getRandomQuestion]);

  const resetGame = useCallback(() => {
    setCurrentPlayer(null);
    setCurrentQuestion(null);
    setGameStarted(false);
    setGameSession(null);
    setQuestionAttempts([]);
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

  // Load existing player if returning to game
  const loadExistingPlayer = useCallback(async (playerId: string) => {
    try {
      const player = await gameApi.getPlayer(playerId);
      const session = await gameApi.getGameSession(player.gameSessionId);
      
      setCurrentPlayer(player);
      setGameSession(session);
      setGameStarted(true);
      setQuestionAttempts(session.questionsAttempted || []);
    } catch (error) {
      console.error('Error loading existing player:', error);
    }
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
    loadExistingPlayer,
    gameSession,
    questionAttempts,
    startPosition: START_POSITION,
    goalPosition: GOAL_POSITION,
    gridSize: GRID_SIZE
  };
}