import React from 'react';
import { Player } from '../types';
import { User, Target, CheckCircle, TrendingUp } from 'lucide-react';

interface PlayerStatsProps {
  player: Player;
}

export default function PlayerStats({ player }: PlayerStatsProps) {
  const accuracy = player.questionsAnswered > 0 ? 
    Math.round((player.correctAnswers / player.questionsAnswered) * 100) : 0;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <User className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-800">{player.name}</h2>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Target className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Steps Taken</span>
          </div>
          <div className="text-2xl font-bold text-blue-900">{player.steps}</div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-800">Correct Answers</span>
          </div>
          <div className="text-2xl font-bold text-green-900">
            {player.correctAnswers}/{player.questionsAnswered}
          </div>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-800">Accuracy</span>
          </div>
          <div className="text-2xl font-bold text-purple-900">{accuracy}%</div>
        </div>
        
        <div className="bg-orange-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-sm font-medium text-orange-800">Status</span>
          </div>
          <div className={`text-sm font-semibold ${player.completed ? 'text-green-600' : 'text-orange-600'}`}>
            {player.completed ? 'Completed!' : 'In Progress'}
          </div>
        </div>
      </div>
    </div>
  );
}