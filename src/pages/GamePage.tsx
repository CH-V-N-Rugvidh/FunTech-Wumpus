import React, { useState, useEffect } from 'react';
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
  } = useGameState(studentToken);

  const [playerName, setPlayerName] = useState('');
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  // Set player name from student data
  React.useEffect(() => {
    if (student && !playerName) {
      setPlayerName(student.full_name || student.username);
    }
  }, [student, playerName]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      createPlayer(playerName.trim());
    }
  };

  // Waiting room view
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
                {waitingRoomPlayers.map((player, index) => (
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

  if (!gameStarted) {
    return (
      <div className="min-h-screen p-4 flex flex-col">
        <div className="max-w-md mx-auto pt-8">
          <div className="glass rounded-2xl p-8 shadow-2xl float">
            <div className="text-center mb-8">
              <div className="relative">
                <Bot className="w-20 h-20 text-white mx-auto mb-4 pulse-glow" />
                <Sparkles className="w-6 h-6 text-yellow-300 absolute -top-2 -right-2 animate-pulse" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-2 gradient-text">Welcome, {student.full_name}!</h1>
              <p className="text-white/80 text-lg">Guide the Wumpus through tech challenges!</p>
              
              {currentGame && (
                <div className="mt-4 p-3 glass-dark rounded-lg">
                  <p className="text-sm text-white/80">
                    Game Status: <span className={`font-semibold ${
                      currentGame.status === 'active' ? 'text-green-400' : 
                      currentGame.status === 'waiting' ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {currentGame.status.charAt(0).toUpperCase() + currentGame.status.slice(1)}
                    </span>
                  </p>
                  {currentGame.status === 'active' && gameTimeLeft > 0 && (
                    <p className="text-sm text-blue-400 font-mono">
                      Time Left: {formatTime(gameTimeLeft)}
                    </p>
                  )}
                </div>
              )}
            </div>
            
            <form onSubmit={handleStartGame} className="space-y-4">
              <div>
                <label htmlFor="playerName" className="block text-sm font-medium text-white/90 mb-3">
                  {currentGame?.status === 'active' ? 'Confirm your name to join' : 'Confirm your name'}
                </label>
                <input
                  type="text"
                  id="playerName"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder={student.full_name || student.username}
                  className="w-full px-4 py-4 glass-dark rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-300"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 btn-glow shadow-lg"
              >
                <Play className="w-5 h-5" />
                <span>
                  {currentGame?.status === 'active' ? 'Join Game' : 
                   currentGame?.status === 'waiting' ? 'Join Waiting Room' : 'Start Game'}
                </span>
              </button>
            </form>
            
            <div className="mt-8 pt-6 border-t border-white/20">
              <button
                onClick={() => setShowLeaderboard(!showLeaderboard)}
                className="w-full text-white/80 hover:text-white font-medium transition-colors duration-300"
              >
                {showLeaderboard ? 'Hide' : 'View'} Leaderboard
              </button>
              <button
                onClick={onLogout}
                className="w-full mt-4 text-white/60 hover:text-white/80 font-medium transition-colors duration-300"
              >
                Logout
              </button>
            </div>
            
            {showLeaderboard && (
              <div className="mt-6">
                <Leaderboard players={players} isCompact={true} />
              </div>
            )}
          </div>
        </div>
        <Footer />
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
            <WumpusGrid
              currentPosition={currentPlayer.currentPosition}
              goalPosition={goalPosition}
              startPosition={startPosition}
              pathTaken={currentPlayer.pathTaken}
              visitedPositions={currentPlayer.visitedPositions}
            />
            
            {currentQuestion && (
              <QuizInterface
                question={currentQuestion}
                onAnswer={answerQuestion}
                disabled={!currentQuestion}
              />
            )}
          </div>
          
          <div className="space-y-6">
            <PlayerStats player={currentPlayer} />
            <Leaderboard players={players} isCompact={true} />
          </div>
        </div>
      </div>
    </div>
  );
}