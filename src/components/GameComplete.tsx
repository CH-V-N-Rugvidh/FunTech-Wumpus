import React from 'react';
import { Player, QuestionAttempt } from '../types';
import { Trophy, Target, CheckCircle, Zap, Sparkles, X, BookOpen } from 'lucide-react';

interface GameCompleteProps {
  player: Player;
  questionAttempts: QuestionAttempt[];
  onRestart: () => void;
}

export default function GameComplete({ player, questionAttempts, onRestart }: GameCompleteProps) {
  const accuracy = player.questionsAnswered > 0 ? 
    Math.round((player.correctAnswers / player.questionsAnswered) * 100) : 0;
  
  const [showDetails, setShowDetails] = React.useState(false);

  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-8 text-center shadow-2xl float">
      <div className="mb-6">
        <div className="relative">
          <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-4 pulse-glow" />
          <Sparkles className="w-8 h-8 text-yellow-300 absolute -top-2 -right-2 animate-pulse" />
        </div>
        <h2 className="text-4xl font-bold text-white mb-2 gradient-text">Congratulations!</h2>
        <p className="text-lg text-white/80">You've successfully guided thez Wumpus to its goal!</p>
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
      
        <div className="flex space-x-4 justify-center">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 btn-glow shadow-lg flex items-center space-x-2"
          >
            <BookOpen className="w-5 h-5" />
            <span>{showDetails ? 'Hide' : 'View'} Game Summary</span>
          </button>
          <button
            onClick={onRestart}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 btn-glow shadow-lg"
          >
            Play Again
          </button>
        </div>
      </div>
      
      {showDetails && (
        <div className="glass rounded-2xl p-6 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-white flex items-center space-x-2">
              <BookOpen className="w-6 h-6 text-blue-400" />
              <span>Game Summary</span>
            </h3>
            <button
              onClick={() => setShowDetails(false)}
              className="text-white/70 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {questionAttempts.map((attempt, index) => (
              <div
                key={index}
                className={`glass-dark rounded-xl p-4 border-2 ${
                  attempt.isCorrect 
                    ? 'border-green-400/50 bg-green-400/10' 
                    : 'border-red-400/50 bg-red-400/10'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-semibold text-white text-sm">
                    Question {index + 1}
                  </h4>
                  <div className={`flex items-center space-x-1 ${
                    attempt.isCorrect ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {attempt.isCorrect ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <X className="w-4 h-4" />
                    )}
                    <span className="text-sm font-medium">
                      {attempt.isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>
                </div>
                
                <p className="text-white/90 mb-3 text-sm">{attempt.question}</p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="text-white/70">Your answer:</span>
                    <span className={attempt.isCorrect ? 'text-green-400' : 'text-red-400'}>
                      {attempt.options[attempt.selectedAnswer]}
                    </span>
                  </div>
                  {!attempt.isCorrect && (
                    <div className="flex items-center space-x-2">
                      <span className="text-white/70">Correct answer:</span>
                      <span className="text-green-400">
                        {attempt.options[attempt.correctAnswer]}
                      </span>
                    </div>
                  )}
                  {!attempt.isCorrect && attempt.explanation && (
                    <div className="mt-3 p-3 bg-blue-400/10 border border-blue-400/30 rounded-lg">
                      <p className="text-blue-200 text-sm">{attempt.explanation}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}