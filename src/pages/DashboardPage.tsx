import React, { useEffect, useState, useCallback } from 'react';
import { Player } from '../types';
import { gameApi } from '../services/api';
import WumpusGrid from '../components/WumpusGrid';
import Leaderboard from '../components/Leaderboard';
import { Monitor, Users, Trophy, Clock, Zap } from 'lucide-react';

export default function DashboardPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [activePlayers, setActivePlayers] = useState<Player[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Get live data from database
  const updatePlayersFromStorage = useCallback(() => {
    try {
      gameApi.getAllPlayers().then(dbPlayers => {
        setPlayers(dbPlayers);
        setActivePlayers(dbPlayers.filter(p => !p.completed));
      }).catch(error => {
        console.error('Error fetching players:', error);
      });
    } catch (error) {
      console.error('Error updating players:', error);
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
  const totalScore = players.reduce((sum, p) => sum + (p.score || 0), 0);

  return (
    <div className="min-h-screen text-white pt-20">
      {/* Header */}
      <div className="glass-dark border-b border-white/10 p-6 fixed top-0 left-0 right-0 z-30">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Monitor className="w-10 h-10 text-blue-400 pulse-glow" />
              <div>
                <h1 className="text-4xl font-bold gradient-text">FunTech Wumpus</h1>
                <p className="text-blue-200 text-lg">Live Event Dashboard</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-mono font-bold">
                {currentTime.toLocaleTimeString()}
              </div>
              <div className="text-blue-200 text-lg">
                {currentTime.toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="glass border-b border-white/10 p-6 mt-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="glass-dark rounded-xl p-6 text-center hover:scale-105 transition-transform duration-300">
              <Users className="w-10 h-10 text-green-400 mx-auto mb-3 pulse-glow" />
              <div className="text-3xl font-bold">{activeCount}</div>
              <div className="text-sm text-white/70">Active Players</div>
            </div>
            <div className="glass-dark rounded-xl p-6 text-center hover:scale-105 transition-transform duration-300">
              <Trophy className="w-10 h-10 text-yellow-400 mx-auto mb-3 pulse-glow" />
              <div className="text-3xl font-bold">{completedCount}</div>
              <div className="text-sm text-white/70">Completed</div>
            </div>
            <div className="glass-dark rounded-xl p-6 text-center hover:scale-105 transition-transform duration-300">
              <Clock className="w-10 h-10 text-blue-400 mx-auto mb-3 pulse-glow " />
              <div className="text-3xl font-bold">{players.length}</div>
              <div className="text-sm text-white/70">Total Players</div>
            </div>
            <div className="glass-dark rounded-xl p-6 text-center hover:scale-105 transition-transform duration-300">
              <Zap className="w-10 h-10 text-purple-400 mx-auto mb-3 pulse-glow" />
              <div className="text-3xl font-bold">{totalScore}</div>
              <div className="text-sm text-white/70">Total Score</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Players */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold mb-8 flex items-center space-x-3">
              <Users className="w-8 h-8 text-green-400" />
              <span>Active Players</span>
            </h2>
            
            {activePlayers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activePlayers.map((player) => (
                  <div key={player.id} className="glass-dark rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all duration-300 float">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-white">{player.name}</h3>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-400">{player.steps}</div>
                        <div className="text-sm text-white/70">steps</div>
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
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-bold text-white">{player.questionsAnswered}</div>
                        <div className="text-white/70">Questions</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-green-400">{player.questionsAnswered > 0 ? Math.round((player.correctAnswers / player.questionsAnswered) * 100) : 0}%</div>
                        <div className="text-white/70">Accuracy</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-purple-400">{player.score || 0}</div>
                        <div className="text-white/70">Score</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-dark rounded-2xl p-16 text-center border border-white/10">
                <Clock className="w-20 h-20 text-white/50 mx-auto mb-6 pulse-glow" />
                <p className="text-2xl text-white/70">Waiting for players to join...</p>
              </div>
            )}
          </div>

          {/* Leaderboard */}
          <div>
            <h2 className="text-3xl font-bold mb-8 flex items-center space-x-3">
              <Trophy className="w-8 h-8 text-yellow-400" />
              <span>Leaderboard</span>
            </h2>
            
            <div className="glass-dark rounded-2xl border border-white/10 overflow-hidden">
              <Leaderboard players={players} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}