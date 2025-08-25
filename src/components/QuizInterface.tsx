import React, { useState, useEffect } from 'react';
import { Question } from '../types';
import { CheckCircle, XCircle, Clock, Lightbulb } from 'lucide-react';

interface QuizInterfaceProps {
  question: Question;
  onAnswer: (selectedAnswer: number) => void;
  disabled?: boolean;
}

export default function QuizInterface({ question, onAnswer, disabled = false }: QuizInterfaceProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  // Reset state when question changes
  useEffect(() => {
    setSelectedOption(null);
    setIsAnswered(false);
    setShowExplanation(false);
  }, [question.id]);

  const handleOptionClick = (optionIndex: number) => {
    if (disabled || isAnswered) return;
    
    setSelectedOption(optionIndex);
    setIsAnswered(true);
    
    // Show explanation only if answer is wrong and explanation is available
    if (optionIndex !== question.correctAnswer && question.explanation) {
      setShowExplanation(true);
    }
    
    // Delay before calling onAnswer to show feedback
    setTimeout(() => {
      onAnswer(optionIndex);
    }, (optionIndex !== question.correctAnswer && question.explanation) ? 3000 : 1500);
  };

  const getOptionClass = (optionIndex: number) => {
    let baseClass = "w-full p-4 text-left rounded-xl border-2 transition-all duration-300 ";
    
    if (disabled) {
      baseClass += "glass-dark text-white/50 cursor-not-allowed ";
    } else if (isAnswered && selectedOption === optionIndex) {
      if (optionIndex === question.correctAnswer) {
        baseClass += "bg-green-400/20 border-green-400 text-green-300 shadow-lg ";
      } else {
        baseClass += "bg-red-400/20 border-red-400 text-red-300 shadow-lg ";
      }
    } else if (isAnswered && optionIndex === question.correctAnswer) {
      baseClass += "bg-green-400/20 border-green-400 text-green-300 shadow-lg ";
    } else {
      baseClass += "glass border-white/20 hover:border-blue-400 hover:bg-white/10 active:scale-95 text-white ";
    }
    
    return baseClass;
  };

  const getDifficultyColor = () => {
    switch (question.difficulty) {
      case 'easy': return 'bg-green-400/20 text-green-300 border-green-400/50';
      case 'medium': return 'bg-yellow-400/20 text-yellow-300 border-yellow-400/50';
      case 'hard': return 'bg-red-400/20 text-red-300 border-red-400/50';
      default: return 'bg-white/20 text-white border-white/50';
    }
  };

  return (
    <div className="glass rounded-2xl p-6 shadow-2xl">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor()}`}>
            {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
          </span>
          <span className="text-sm text-white/70 capitalize">
            {question.category.replace('-', ' ')}
          </span>
        </div>
        {disabled && <Clock className="w-5 h-5 text-white/50" />}
      </div>
      
      <h2 className="text-xl font-bold text-white mb-6">
        {question.question}
      </h2>
      
      <div className="space-y-3">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionClick(index)}
            disabled={disabled || isAnswered}
            className={getOptionClass(index)}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">
                {String.fromCharCode(65 + index)}. {option}
              </span>
              {isAnswered && selectedOption === index && (
                index === question.correctAnswer ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400" />
                )
              )}
              {isAnswered && selectedOption !== index && index === question.correctAnswer && (
                <CheckCircle className="w-5 h-5 text-green-400" />
              )}
            </div>
          </button>
        ))}
      </div>
      
      {showExplanation && question.explanation && (
        <div className="mt-6 glass-dark rounded-xl p-4 border border-blue-400/50">
          <div className="flex items-start space-x-3">
            <Lightbulb className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-white mb-2">Explanation</h4>
              <p className="text-white/80 text-sm">{question.explanation}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}