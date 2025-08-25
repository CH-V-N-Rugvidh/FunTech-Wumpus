import React from 'react';
import { Player } from '../types';
import { Trophy, Medal, Award, Clock, Zap } from 'lucide-react';

interface LeaderboardProps {
  players: Player[];
  isCompact?: boolean;
}

export default function Leaderboard({ players, isCompact = false }: LeaderboardProps) {
  const completedPlayers = players
    .filter(player => player.completed)
    .sort((a, b) => {
      // Primary sort by steps (fewer is better)
      if (a.steps !== b.steps) return a.steps - b.steps;
      // Secondary sort by score (higher is better)
      return (b.score || 0) - (a.score || 0);
    })
    .slice(0, 10);

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 0: return <Trophy className="w-6 h-6 text-yellow-400 pulse-glow" />;
      case 1: return <Medal className="w-6 h-6 text-gray-300" />;
      case 2: return <Award className="w-6 h-6 text-orange-400" />;
      default: return <span className="w-6 h-6 flex items-center justify-center text-white font-bold">{position + 1}</span>;
    }
  };

  const getPositionBg = (position: number) => {
    switch (position) {
      case 0: return 'bg-gradient-to-r from-yellow-400/20 to-yellow-500/20 border-yellow-400/50';
      case 1: return 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/50';
      case 2: return 'bg-gradient-to-r from-orange-400/20 to-orange-500/20 border-orange-400/50';
      default: return 'glass-dark border-white/20';
    }
  };

  if (completedPlayers.length === 0) {
    return (
      <div className="glass rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-center space-x-2 mb-6">
          <Trophy className="w-6 h-6 text-yellow-400" />
          <h2 className="text-xl font-bold text-white">Leaderboard</h2>
        </div>
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-white/50 mx-auto mb-4 pulse-glow" />
          <p className="text-white/70">No completed games yet. Be the first to reach the goal!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center justify-center space-x-2 mb-6">
        <Trophy className="w-6 h-6 text-yellow-400" />
        <h2 className={`${isCompact ? 'text-lg' : 'text-xl'} font-bold text-white`}>Leaderboard</h2>
      </div>
      
      <div className="space-y-3">
        {completedPlayers.map((player, index) => (
          <div
            key={player.id}
            className={`flex items-center justify-between p-4 rounded-xl border-2 ${getPositionBg(index)} transition-all duration-300 hover:scale-105`}
          >
            <div className="flex items-center space-x-4">
              {getPositionIcon(index)}
              <div>
                <h3 className={`${isCompact ? 'text-sm' : 'text-base'} font-bold text-white`}>
                  {player.name}
                </h3>
                <p className="text-xs text-white/70">
                  {player.correctAnswers}/{player.questionsAnswered} correct • Score: {player.score || 0}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className={`${isCompact ? 'text-lg' : 'text-xl'} font-bold text-white flex items-center space-x-1`}>
                <Target className="w-4 h-4 text-blue-400" />
                <span>{player.steps}</span>
              </div>
              <div className="text-xs text-white/70 flex items-center space-x-1 justify-end">
                <Zap className="w-3 h-3 text-yellow-400" />
                {player.steps} steps
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {completedPlayers.length > 3 && !isCompact && (
        <div className="mt-4 text-center">
          <p className="text-sm text-white/70">
            Showing top {Math.min(completedPlayers.length, 10)} players
          </p>
        </div>
      )}
    </div>
  );
}