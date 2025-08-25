import React from 'react';
import { Player } from '../types';
import { Trophy, Medal, Award, Clock } from 'lucide-react';

interface LeaderboardProps {
  players: Player[];
  isCompact?: boolean;
}

export default function Leaderboard({ players, isCompact = false }: LeaderboardProps) {
  const completedPlayers = players
    .filter(player => player.completed)
    .sort((a, b) => a.steps - b.steps)
    .slice(0, 10);

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 0: return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 1: return <Medal className="w-6 h-6 text-gray-400" />;
      case 2: return <Award className="w-6 h-6 text-orange-600" />;
      default: return <span className="w-6 h-6 flex items-center justify-center text-gray-600 font-bold">{position + 1}</span>;
    }
  };

  const getPositionBg = (position: number) => {
    switch (position) {
      case 0: return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200';
      case 1: return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200';
      case 2: return 'bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200';
      default: return 'bg-white border-gray-200';
    }
  };

  if (completedPlayers.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center space-x-2 mb-6">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <h2 className="text-xl font-bold text-gray-800">Leaderboard</h2>
        </div>
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No completed games yet. Be the first to reach the goal!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-center space-x-2 mb-6">
        <Trophy className="w-6 h-6 text-yellow-500" />
        <h2 className={`${isCompact ? 'text-lg' : 'text-xl'} font-bold text-gray-800`}>Leaderboard</h2>
      </div>
      
      <div className="space-y-3">
        {completedPlayers.map((player, index) => (
          <div
            key={player.id}
            className={`flex items-center justify-between p-4 rounded-lg border-2 ${getPositionBg(index)} transition-all duration-200`}
          >
            <div className="flex items-center space-x-4">
              {getPositionIcon(index)}
              <div>
                <h3 className={`${isCompact ? 'text-sm' : 'text-base'} font-semibold text-gray-800`}>
                  {player.name}
                </h3>
                <p className="text-xs text-gray-600">
                  {player.correctAnswers}/{player.questionsAnswered} correct
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className={`${isCompact ? 'text-lg' : 'text-xl'} font-bold text-gray-800`}>
                {player.steps} steps
              </div>
              <div className="text-xs text-gray-500">
                {player.completedAt ? new Date(player.completedAt).toLocaleTimeString() : ''}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {completedPlayers.length > 3 && !isCompact && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            Showing top {Math.min(completedPlayers.length, 10)} players
          </p>
        </div>
      )}
    </div>
  );
}