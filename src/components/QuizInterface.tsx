import React, { useState } from 'react';
import { Question } from '../types';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface QuizInterfaceProps {
  question: Question;
  onAnswer: (selectedAnswer: number) => void;
  disabled?: boolean;
}

export default function QuizInterface({ question, onAnswer, disabled = false }: QuizInterfaceProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleOptionClick = (optionIndex: number) => {
    if (disabled || isAnswered) return;
    
    setSelectedOption(optionIndex);
    setIsAnswered(true);
    
    // Small delay to show selection before calling onAnswer
    setTimeout(() => {
      onAnswer(optionIndex);
      setSelectedOption(null);
      setIsAnswered(false);
    }, 1000);
  };

  const getOptionClass = (optionIndex: number) => {
    let baseClass = "w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ";
    
    if (disabled) {
      baseClass += "bg-gray-100 text-gray-500 cursor-not-allowed ";
    } else if (isAnswered && selectedOption === optionIndex) {
      if (optionIndex === question.correctAnswer) {
        baseClass += "bg-green-100 border-green-500 text-green-800 ";
      } else {
        baseClass += "bg-red-100 border-red-500 text-red-800 ";
      }
    } else if (isAnswered && optionIndex === question.correctAnswer) {
      baseClass += "bg-green-100 border-green-500 text-green-800 ";
    } else {
      baseClass += "bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50 active:scale-95 ";
    }
    
    return baseClass;
  };

  const getDifficultyColor = () => {
    switch (question.difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor()}`}>
            {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
          </span>
          <span className="text-sm text-gray-500 capitalize">
            {question.category.replace('-', ' ')}
          </span>
        </div>
        {disabled && <Clock className="w-5 h-5 text-gray-400" />}
      </div>
      
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
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
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )
              )}
              {isAnswered && selectedOption !== index && index === question.correctAnswer && (
                <CheckCircle className="w-5 h-5 text-green-600" />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}