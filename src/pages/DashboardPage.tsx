import React, { useEffect, useState, useCallback } from 'react';
import { Player } from '../types';
import WumpusGrid from '../components/WumpusGrid';
import Leaderboard from '../components/Leaderboard';
import { Monitor, Users, Trophy, Clock } from 'lucide-react';

export default function DashboardPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [activePlayers, setActivePlayers] = useState<Player[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Get live data from localStorage (shared with game state)
  const updatePlayersFromStorage = useCallback(() => {
    try {
      const storedPlayers = localStorage.getItem('funtech-wumpus-players');
      if (storedPlayers) {
        const parsedPlayers: Player[] = JSON.parse(storedPlayers);
        setPlayers(parsedPlayers);
        setActivePlayers(parsedPlayers.filter(p => !p.completed));
      }
    } catch (error) {
      console.error('Error reading players from storage:', error);
    }
  }, []);

  useEffect(() => {
    // Initial load
    updatePlayersFromStorage();

    // Update players data every 2 seconds
    const playersInterval = setInterval(updatePlayersFromStorage, 2000);

    // Update time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(playersInterval);
      clearInterval(timeInterval);
    };
  }, [updatePlayersFromStorage]);

  const completedCount = players.filter(p => p.completed).length;
  const activeCount = players.filter(p => !p.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Monitor className="w-8 h-8 text-blue-400" />
              <div>
                <h1 className="text-3xl font-bold">FunTech Wumpus</h1>
                <p className="text-blue-200">Live Event Dashboard</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-mono">
                {currentTime.toLocaleTimeString()}
              </div>
              <div className="text-blue-200">
                {currentTime.toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-black/10 backdrop-blur-sm border-b border-white/10 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <Users className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold">{activeCount}</div>
              <div className="text-sm text-gray-300">Active Players</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold">{completedCount}</div>
              <div className="text-sm text-gray-300">Completed</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <Clock className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold">{players.length}</div>
              <div className="text-sm text-gray-300">Total Players</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Players */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
              <Users className="w-6 h-6" />
              <span>Active Players</span>
            </h2>
            
            {activePlayers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activePlayers.map((player) => (
                  <div key={player.id} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold">{player.name}</h3>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-400">{player.steps}</div>
                        <div className="text-sm text-gray-300">steps</div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <WumpusGrid
                        currentPosition={player.currentPosition}
                        goalPosition={{ x: 9, y: 9 }}
                        startPosition={{ x: 0, y: 0 }}
                        gridSize={10}
                      />
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span>Questions: {player.questionsAnswered}</span>
                      <span>Accuracy: {player.questionsAnswered > 0 ? Math.round((player.correctAnswers / player.questionsAnswered) * 100) : 0}%</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-12 text-center border border-white/10">
                <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-xl text-gray-300">Waiting for players to join...</p>
              </div>
            )}
          </div>

          {/* Leaderboard */}
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
              <Trophy className="w-6 h-6" />
              <span>Leaderboard</span>
            </h2>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
              <Leaderboard players={players} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}