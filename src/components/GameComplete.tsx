import React from 'react';
import { Player } from '../types';
import { Trophy, Clock, Target, CheckCircle } from 'lucide-react';

interface GameCompleteProps {
  player: Player;
  onRestart: () => void;
}

export default function GameComplete({ player, onRestart }: GameCompleteProps) {
  const accuracy = player.questionsAnswered > 0 ? 
    Math.round((player.correctAnswers / player.questionsAnswered) * 100) : 0;

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 text-center">
      <div className="mb-6">
        <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Congratulations!</h2>
        <p className="text-lg text-gray-600">You've successfully guided the Wumpus to its goal!</p>
      </div>
      
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Final Stats</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4">
            <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">{player.steps}</div>
            <div className="text-sm text-gray-600">Total Steps</div>
          </div>
          <div className="bg-white rounded-lg p-4">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">{accuracy}%</div>
            <div className="text-sm text-gray-600">Accuracy</div>
          </div>
        </div>
      </div>
      
      <div className="text-center mb-6">
        <p className="text-gray-600 mb-2">
          You answered <span className="font-semibold">{player.correctAnswers}</span> out of{' '}
          <span className="font-semibold">{player.questionsAnswered}</span> questions correctly!
        </p>
        <p className="text-sm text-gray-500">
          Completed at {player.completedAt ? new Date(player.completedAt).toLocaleString() : ''}
        </p>
      </div>
      
      <button
        onClick={onRestart}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
      >
        Play Again
      </button>
    </div>
  );
}