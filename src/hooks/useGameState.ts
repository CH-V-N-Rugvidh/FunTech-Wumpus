import { useState, useCallback } from 'react';
import { Player, Question, Position, GameSession, QuestionAttempt } from '../types';
import { gameApi } from '../services/api';
import { getNextOptimalMove, getValidMove, calculateDistance } from '../utils/pathfinding';
import React from 'react';

const GRID_SIZE = 10;
const START_POSITION: Position = { x: 0, y: 0 };
const GOAL_POSITION: Position = { x: 9, y: 9 };

export function useGameState() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentGame, setCurrentGame] = useState<any>(null);
  const [gameTimeLeft, setGameTimeLeft] = useState<number>(0);
  const [waitingRoomPlayers, setWaitingRoomPlayers] = useState<any[]>([]);
  const [isInWaitingRoom, setIsInWaitingRoom] = useState(false);
  const [waitingPlayerId, setWaitingPlayerId] = useState<string | null>(null);
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
  const loadPlayers = useCallback(async (gameId?: string) => {
    try {
      const dbPlayers = gameId ? await gameApi.getPlayersByGame(gameId) : await gameApi.getAllPlayers();
      setPlayers(dbPlayers);
    } catch (error) {
      console.error('Error loading players:', error);
    }
  }, []);

  // Load current game status
  const loadCurrentGame = useCallback(async () => {
    try {
      const { game } = await gameApi.getCurrentGame();
      setCurrentGame(game);
      
      if (game && game.status === 'active') {
        const startTime = new Date(game.started_at).getTime();
        const duration = game.duration_minutes * 60 * 1000;
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, duration - elapsed);
        setGameTimeLeft(Math.floor(remaining / 1000));
        
        // Load players for this game
        loadPlayers(game.id);
        
        // If player is in waiting room and game is active, redirect to game
        if (isInWaitingRoom) {
          setIsInWaitingRoom(false);
          setWaitingPlayerId(null);
        }
      }
    } catch (error) {
      console.error('Error loading current game:', error);
    }
  }, [loadPlayers, isInWaitingRoom]);

  // Load waiting room players
  const loadWaitingRoom = useCallback(async () => {
    try {
      const waitingPlayers = await gameApi.getWaitingRoomPlayers();
      setWaitingRoomPlayers(waitingPlayers);
    } catch (error) {
      console.error('Error loading waiting room:', error);
      // Set empty array on error to prevent UI issues
      setWaitingRoomPlayers([]);
    }
  }, []);

  // Initialize data on first load
  React.useEffect(() => {
    loadQuestions();
    loadCurrentGame();
    loadWaitingRoom();
    
    // Set up intervals for real-time updates
    const gameInterval = setInterval(loadCurrentGame, 2000);
    const waitingInterval = setInterval(loadWaitingRoom, 2000);
    
    return () => {
      clearInterval(gameInterval);
      clearInterval(waitingInterval);
    };
  }, [loadQuestions, loadCurrentGame, loadWaitingRoom]);

  // Game timer effect
  React.useEffect(() => {
    if (gameTimeLeft > 0) {
      const timer = setTimeout(() => {
        setGameTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (gameTimeLeft === 0 && currentGame?.status === 'active') {
      // Game time is up
      setGameStarted(false);
      setCurrentPlayer(null);
      setCurrentQuestion(null);
    }
  }, [gameTimeLeft, currentGame]);

  // Check if player should be redirected from waiting room to game
  React.useEffect(() => {
    if (isInWaitingRoom && currentGame?.status === 'active') {
      // Game has started, redirect player to game
      const playerName = localStorage.getItem('waiting-player-name');
      if (playerName) {
        setIsInWaitingRoom(false);
        setWaitingPlayerId(null);
        localStorage.removeItem('waiting-player-name');
        createPlayer(playerName);
      }
    }
  }, [currentGame, isInWaitingRoom]);

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
    // Check if there's an active game
    if (!currentGame || currentGame.status !== 'active') {
      // Join waiting room instead
      joinWaitingRoom(name);
      return null;
    }

    if (questions.length === 0) {
      console.error('No questions available');
      return null;
    }

    const playerId = `player-${Date.now()}-${Math.random()}`;
    const sessionId = `session-${Date.now()}-${Math.random()}`;
    
    const newPlayer: Player = {
      id: playerId,
      gameId: currentGame.id,
      name,
      currentPosition: { ...START_POSITION },
      previousPosition: null,
      pathTaken: [{ ...START_POSITION }],
      visitedPositions: [{ ...START_POSITION }],
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
      gameId: currentGame.id,
      playerId,
      questionsAttempted: [],
      startedAt: new Date(),
      finalScore: 0,
      pathTaken: [{ ...START_POSITION }],
      visitedPositions: [{ ...START_POSITION }]
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
  }, [players, questions, getRandomQuestion, currentGame]);

  const joinWaitingRoom = useCallback(async (name: string) => {
    try {
      const result = await gameApi.joinWaitingRoom(name);
      setWaitingPlayerId(result.playerId);
      setIsInWaitingRoom(true);
      localStorage.setItem('waiting-player-name', name);
      loadWaitingRoom();
    } catch (error) {
      console.error('Error joining waiting room:', error);
    }
  }, [loadWaitingRoom]);

  const leaveWaitingRoom = useCallback(async () => {
    if (waitingPlayerId) {
      try {
        await gameApi.leaveWaitingRoom(waitingPlayerId);
        setWaitingPlayerId(null);
        setIsInWaitingRoom(false);
        localStorage.removeItem('waiting-player-name');
        loadWaitingRoom();
      } catch (error) {
        console.error('Error leaving waiting room:', error);
      }
    }
  }, [waitingPlayerId, loadWaitingRoom]);

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
    
    // Get next valid move that hasn't been visited
    const newPosition = getValidMove(
      currentPlayer.currentPosition,
      GOAL_POSITION,
      currentPlayer.visitedPositions,
      GRID_SIZE,
      isCorrect
    );

    const newPathTaken = [...currentPlayer.pathTaken, newPosition];
    const newVisitedPositions = currentPlayer.visitedPositions.some(
      pos => pos.x === newPosition.x && pos.y === newPosition.y
    ) ? currentPlayer.visitedPositions : [...currentPlayer.visitedPositions, newPosition];

    const updatedPlayer: Player = {
      ...currentPlayer,
      previousPosition: { ...currentPlayer.currentPosition },
      currentPosition: newPosition,
      pathTaken: newPathTaken,
      visitedPositions: newVisitedPositions,
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
      pathTaken: newPathTaken,
      visitedPositions: newVisitedPositions,
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
    setIsInWaitingRoom(false);
    setWaitingPlayerId(null);
    setGameSession(null);
    setQuestionAttempts([]);
    localStorage.removeItem('waiting-player-name');
  }, []);

  const getLeaderboard = useCallback(() => {
    return players
      .filter(player => player.completed)
      .sort((a, b) => {
        // Primary sort by steps (fewer is better)
        if (a.steps !== b.steps) return a.steps - b.steps;
        // Secondary sort by completion time (earlier is better)
        if (a.completedAt && b.completedAt) {
          return new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime();
        }
        // Tertiary sort by score (higher is better)
        return (b.score || 0) - (a.score || 0);
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
    currentGame,
    gameTimeLeft,
    isInWaitingRoom,
    waitingRoomPlayers,
    createPlayer,
    joinWaitingRoom,
    leaveWaitingRoom,
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