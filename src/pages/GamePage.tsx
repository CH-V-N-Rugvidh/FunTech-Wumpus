import React, { useState } from 'react';
import { useGameState } from '../hooks/useGameState';
import WumpusGrid from '../components/WumpusGrid';
import QuizInterface from '../components/QuizInterface';
import PlayerStats from '../components/PlayerStats';
import GameComplete from '../components/GameComplete';
import Leaderboard from '../components/Leaderboard';
import { Bot, Play, ArrowLeft } from 'lucide-react';

export default function GamePage() {
  const {
    currentPlayer,
    currentQuestion,
    gameStarted,
    createPlayer,
    answerQuestion,
    resetGame,
    getLeaderboard,
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
        <div className="max-w-md mx-auto pt-8">
          <div className="bg-white rounded-xl shadow-xl p-8">
            <div className="text-center mb-8">
              <Bot className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-800 mb-2">FunTech Wumpus</h1>
              <p className="text-gray-600">Guide the Wumpus through tech challenges!</p>
            </div>
            
            <form onSubmit={handleStartGame} className="space-y-4">
              <div>
                <label htmlFor="playerName" className="block text-sm font-medium text-gray-700 mb-2">
                  Enter your name to start
                </label>
                <input
                  type="text"
                  id="playerName"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Play className="w-5 h-5" />
                <span>Start Game</span>
              </button>
            </form>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => setShowLeaderboard(!showLeaderboard)}
                className="w-full text-blue-600 hover:text-blue-700 font-medium"
              >
                {showLeaderboard ? 'Hide' : 'View'} Leaderboard
              </button>
            </div>
            
            {showLeaderboard && (
              <div className="mt-4">
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <button
              onClick={resetGame}
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Start</span>
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GameComplete player={currentPlayer} onRestart={resetGame} />
            <Leaderboard players={players} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">FunTech Wumpus</h1>
          <button
            onClick={resetGame}
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
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