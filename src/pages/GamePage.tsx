import React, { useState } from 'react';
import { useGameState } from '../hooks/useGameState';
import WumpusGrid from '../components/WumpusGrid';
import QuizInterface from '../components/QuizInterface';
import PlayerStats from '../components/PlayerStats';
import GameComplete from '../components/GameComplete';
import Leaderboard from '../components/Leaderboard';
import { Bot, Clock, Play, ArrowLeft, Users, Sparkles } from 'lucide-react';
import { Student } from '../types';
import Footer from '../components/Footer';

interface GamePageProps {
  student: Student;
  studentToken: string;
  onLogout: () => void;
}


export default function GamePage({ student, studentToken, onLogout }: GamePageProps) {
  const [redirectToDashboard, setRedirectToDashboard] = useState(false);
  const [playerName, setPlayerName] = useState<string>("");
  const [nameSubmitted, setNameSubmitted] = useState<boolean>(false);
  const {
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
    gameSession,
    questionAttempts,
    startPosition,
    goalPosition,
    players
  } = useGameState(studentToken, () => setRedirectToDashboard(true));
  // Redirect to dashboard if timeout triggers
  React.useEffect(() => {
    if (redirectToDashboard) {
      // Use a custom event to notify App to setCurrentView('dashboard')
      const event = new CustomEvent('redirect-dashboard');
      window.dispatchEvent(event);
    }
  }, [redirectToDashboard]);


  const [showLeaderboard, setShowLeaderboard] = useState(false);


  // Handle player entry after name is submitted
  React.useEffect(() => {
    if (!nameSubmitted || !playerName) return;
    if (!currentPlayer) {
      if (currentGame?.status === 'active') {
        createPlayer(playerName);
      } else if (currentGame?.status === 'waiting' || !currentGame) {
        // Prevent duplicate join: check if already in waiting room
        const alreadyInWaitingRoom = waitingRoomPlayers.some(
          (p) => p.player_name?.trim().toLowerCase() === playerName.trim().toLowerCase()
        );
        if (!alreadyInWaitingRoom) {
          joinWaitingRoom(playerName);
        }
      }
    }
    // If already in waiting room, useGameState will handle auto-join on game start
  }, [nameSubmitted, playerName, currentPlayer, currentGame, createPlayer, joinWaitingRoom, waitingRoomPlayers]);


  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Name entry form (first step after login)
  if (!nameSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <form
          className="glass rounded-2xl p-8 shadow-2xl max-w-md w-full"
          onSubmit={e => {
            e.preventDefault();
            if (playerName.trim()) setNameSubmitted(true);
          }}
        >
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Enter Your Name</h2>
          <input
            type="text"
            className="w-full px-4 py-3 rounded-xl text-lg mb-6 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder={student.full_name || student.username}
            value={playerName}
            onChange={e => setPlayerName(e.target.value)}
            required
            maxLength={32}
            autoFocus
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 btn-glow shadow-lg"
          >
            Continue
          </button>
        </form>
      </div>
    );
  }

  // Waiting room view (no join form, just info)
  if (isInWaitingRoom) {
    return (
      <div className="min-h-screen p-4 flex flex-col">
        <div className="max-w-2xl mx-auto pt-8">
          <div className="glass rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <Clock className="w-20 h-20 text-blue-400 mx-auto mb-4 pulse-glow" />
              <h1 className="text-4xl font-bold text-white mb-2 gradient-text">Waiting Room</h1>
              <p className="text-white/80 text-lg">Waiting for the game to start...</p>
            </div>
            <div className="glass-dark rounded-xl p-6 mb-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                <Users className="w-6 h-6 text-green-400" />
                <span>Players in Waiting Room ({waitingRoomPlayers.length})</span>
              </h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {waitingRoomPlayers.map((player) => (
                  <div key={player.id} className="flex items-center justify-between p-3 glass rounded-lg">
                    <span className="text-white font-medium">{player.player_name}</span>
                    <span className="text-white/60 text-sm">
                      {new Date(player.joined_at).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="" style={{ marginBottom: '1.5rem' }}>
              <h3 className="text-xl font-bold text-white mb-4">Dashboard Preview</h3>
              <Leaderboard players={players} isCompact={true} />
            </div>
            <div className="text-center">
              <button
                onClick={leaveWaitingRoom}
                className="bg-red-500/20 hover:bg-red-500/30 text-red-300 font-semibold py-3 px-6 rounded-xl transition-all duration-300 border border-red-400/50"
              >
                Leave Waiting Room
              </button>
              <button
                onClick={onLogout}
                className="ml-4 bg-gray-500/20 hover:bg-gray-500/30 text-gray-300 font-semibold py-3 px-6 rounded-xl transition-all duration-300 border border-gray-400/50"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // No join form: if not in waiting room and not in game, show loading or status
  if (!gameStarted && !isInWaitingRoom) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Clock className="w-16 h-16 text-blue-400 mx-auto mb-4 animate-spin" />
          <h2 className="text-2xl text-white font-bold mb-2">Preparing your game...</h2>
          <p className="text-white/70">Please wait while we check the game status.</p>
        </div>
      </div>
    );
  }

  if (currentPlayer?.completed) {
    return (
      <div className="min-h-screen p-4 flex flex-col">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <button
              onClick={resetGame}
              className="inline-flex items-center space-x-2 text-white/80 hover:text-white font-medium transition-colors duration-300 glass px-4 py-2 rounded-lg"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Start</span>
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GameComplete player={currentPlayer} questionAttempts={questionAttempts} onRestart={resetGame} />
            <Leaderboard players={players} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 flex flex-col">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 gradient-text">FunTech Wumpus</h1>
          
          {gameTimeLeft > 0 && (
            <div className="glass px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-blue-400" />
                <span className="text-white font-mono text-lg">{formatTime(gameTimeLeft)}</span>
              </div>
            </div>
          )}
          
          <button
            onClick={resetGame}
            className="inline-flex items-center space-x-2 text-white/80 hover:text-white font-medium transition-colors duration-300 glass px-4 py-2 rounded-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Start</span>
          </button>
          <button
            onClick={onLogout}
            className="inline-flex items-center space-x-2 text-white/60 hover:text-white/80 font-medium transition-colors duration-300 glass px-4 py-2 rounded-lg"
          >
            <span>Logout</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {currentPlayer && (
              <WumpusGrid
                currentPosition={currentPlayer.currentPosition}
                goalPosition={goalPosition}
                startPosition={startPosition}
                pathTaken={currentPlayer.pathTaken}
                visitedPositions={currentPlayer.visitedPositions}
              />
            )}
            {currentQuestion && (
              <QuizInterface
                question={currentQuestion}
                onAnswer={answerQuestion}
                disabled={!currentQuestion}
              />
            )}
          </div>
          <div className="space-y-6">
            {currentPlayer && <PlayerStats player={currentPlayer} />}
            <Leaderboard players={players} isCompact={true} />
          </div>
        </div>
      </div>
    </div>
  );
}