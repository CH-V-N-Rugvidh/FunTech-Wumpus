import React, { useState, useEffect } from 'react';
import { useGameState } from '../hooks/useGameState';
import WumpusGrid from '../components/WumpusGrid';
import QuizInterface from '../components/QuizInterface';
import PlayerStats from '../components/PlayerStats';
import GameComplete from '../components/GameComplete';
import Leaderboard from '../components/Leaderboard';
import { Bot, Play, ArrowLeft, Sparkles } from 'lucide-react';
import { Question } from '../types';

export default function GamePage() {
  const {
    currentPlayer,
    currentQuestion,
    gameStarted,
    createPlayer,
    answerQuestion,
    resetGame,
    getLeaderboard,
    gameSession,
    questionAttempts,
    startPosition,
    goalPosition,
    players
  } = useGameState();

  const [playerName, setPlayerName] = useState('');
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const handleStartGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      createPlayer(playerName.trim());
    }
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-md mx-auto pt-8">
          <div className="glass rounded-2xl p-8 shadow-2xl float">
            <div className="text-center mb-8">
              <div className="relative">
                <Bot className="w-20 h-20 text-white mx-auto mb-4 pulse-glow" />
                <Sparkles className="w-6 h-6 text-yellow-300 absolute -top-2 -right-2 animate-pulse" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-2 gradient-text">FunTech Wumpus</h1>
              <p className="text-white/80 text-lg">Guide the Wumpus through tech challenges!</p>
            </div>
            
            <form onSubmit={handleStartGame} className="space-y-4">
              <div>
                <label htmlFor="playerName" className="block text-sm font-medium text-white/90 mb-3">
                  Enter your name to start
                </label>
                <input
                  type="text"
                  id="playerName"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-4 py-4 glass-dark rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-300"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 btn-glow shadow-lg"
              >
                <Play className="w-5 h-5" />
                <span>Start Game</span>
              </button>
            </form>
            
            <div className="mt-8 pt-6 border-t border-white/20">
              <button
                onClick={() => setShowLeaderboard(!showLeaderboard)}
                className="w-full text-white/80 hover:text-white font-medium transition-colors duration-300"
              >
                {showLeaderboard ? 'Hide' : 'View'} Leaderboard
              </button>
            </div>
            
            {showLeaderboard && (
              <div className="mt-6">
                <Leaderboard players={players} isCompact={true} />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (currentPlayer?.completed) {
    return (
      <div className="min-h-screen p-4">
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
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 gradient-text">FunTech Wumpus</h1>
          <button
            onClick={resetGame}
            className="inline-flex items-center space-x-2 text-white/80 hover:text-white font-medium transition-colors duration-300 glass px-4 py-2 rounded-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Start</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <WumpusGrid
              currentPosition={currentPlayer.currentPosition}
              goalPosition={goalPosition}
              startPosition={startPosition}
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