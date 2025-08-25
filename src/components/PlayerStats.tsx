import React from 'react';
import { Player } from '../types';
import { User, Target, CheckCircle, TrendingUp, Zap } from 'lucide-react';

interface PlayerStatsProps {
  player: Player;
}

export default function PlayerStats({ player }: PlayerStatsProps) {
  const accuracy = player.questionsAnswered > 0 ? 
    Math.round((player.correctAnswers / player.questionsAnswered) * 100) : 0;

  return (
    <div className="glass rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center space-x-3 mb-6">
        <User className="w-6 h-6 text-blue-400" />
        <h2 className="text-xl font-bold text-white">{player.name}</h2>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-dark rounded-xl p-4 hover:scale-105 transition-transform duration-300">
          <div className="flex items-center space-x-2 mb-2">
            <Target className="w-5 h-5 text-blue-400" />
            <span className="text-sm font-medium text-white/80">Steps Taken</span>
          </div>
          <div className="text-2xl font-bold text-blue-400">{player.steps}</div>
        </div>
        
        <div className="glass-dark rounded-xl p-4 hover:scale-105 transition-transform duration-300">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-sm font-medium text-white/80">Correct Answers</span>
          </div>
          <div className="text-2xl font-bold text-green-400">
            {player.correctAnswers}/{player.questionsAnswered}
          </div>
        </div>
        
        <div className="glass-dark rounded-xl p-4 hover:scale-105 transition-transform duration-300">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            <span className="text-sm font-medium text-white/80">Accuracy</span>
          </div>
          <div className="text-2xl font-bold text-purple-400">{accuracy}%</div>
        </div>
        
        <div className="glass-dark rounded-xl p-4 hover:scale-105 transition-transform duration-300">
          <div className="flex items-center space-x-2 mb-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            <span className="text-sm font-medium text-white/80">Score</span>
          </div>
          <div className="text-2xl font-bold text-yellow-400">{player.score || 0}</div>
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
          player.completed 
            ? 'bg-green-400/20 text-green-300 border border-green-400/50' 
            : 'bg-orange-400/20 text-orange-300 border border-orange-400/50'
        }`}>
          {player.completed ? '🎉 Completed!' : '🎮 In Progress'}
        </div>
      </div>
    </div>
  );
}