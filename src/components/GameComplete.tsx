import React from 'react';
import { Player } from '../types';
import { Trophy, Target, CheckCircle, Zap, Sparkles } from 'lucide-react';

interface GameCompleteProps {
  player: Player;
  onRestart: () => void;
}

export default function GameComplete({ player, onRestart }: GameCompleteProps) {
  const accuracy = player.questionsAnswered > 0 ? 
    Math.round((player.correctAnswers / player.questionsAnswered) * 100) : 0;

  return (
    <div className="glass rounded-2xl p-8 text-center shadow-2xl float">
      <div className="mb-6">
        <div className="relative">
          <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-4 pulse-glow" />
          <Sparkles className="w-8 h-8 text-yellow-300 absolute -top-2 -right-2 animate-pulse" />
        </div>
        <h2 className="text-4xl font-bold text-white mb-2 gradient-text">Congratulations!</h2>
        <p className="text-lg text-white/80">You've successfully guided the Wumpus to its goal!</p>
      </div>
      
      <div className="glass-dark rounded-xl p-6 mb-6">
        <h3 className="text-xl font-bold text-white mb-4">Final Stats</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="glass rounded-xl p-4 hover:scale-105 transition-transform duration-300">
            <Target className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-400">{player.steps}</div>
            <div className="text-sm text-white/70">Total Steps</div>
          </div>
          <div className="glass rounded-xl p-4 hover:scale-105 transition-transform duration-300">
            <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-400">{accuracy}%</div>
            <div className="text-sm text-white/70">Accuracy</div>
          </div>
          <div className="glass rounded-xl p-4 hover:scale-105 transition-transform duration-300">
            <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-400">{player.score || 0}</div>
            <div className="text-sm text-white/70">Final Score</div>
          </div>
        </div>
      </div>
      
      <div className="text-center mb-6">
        <p className="text-white/80 mb-2">
          You answered <span className="font-semibold">{player.correctAnswers}</span> out of{' '}
          <span className="font-semibold">{player.questionsAnswered}</span> questions correctly!
        </p>
        <p className="text-sm text-white/60">
          Completed at {player.completedAt ? new Date(player.completedAt).toLocaleString() : ''}
        </p>
      </div>
      
      <button
        onClick={onRestart}
        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 btn-glow shadow-lg"
      >
        Play Again
      </button>
    </div>
  );
}