import React from 'react';
import { Position } from '../types';
import { Bot, Target, Home, Sparkles } from 'lucide-react';

interface WumpusGridProps {
  currentPosition: Position;
  goalPosition: Position;
  startPosition: Position;
  path?: Position[];
  gridSize?: number;
  showPath?: boolean;
}

export default function WumpusGrid({ 
  currentPosition, 
  goalPosition, 
  startPosition,
  path = [],
  gridSize = 10,
  showPath = false 
}: WumpusGridProps) {
  const renderCell = (x: number, y: number) => {
    const isStart = x === startPosition.x && y === startPosition.y;
    const isGoal = x === goalPosition.x && y === goalPosition.y;
    const isCurrent = x === currentPosition.x && y === currentPosition.y;
    const isPath = showPath && path.some(p => p.x === x && p.y === y);
    
    let cellClass = "w-8 h-8 sm:w-10 sm:h-10 border border-white/20 flex items-center justify-center relative transition-all duration-500";
    
    if (isStart && !isCurrent) {
      cellClass += " bg-green-400/20 border-green-400/50";
    } else if (isGoal) {
      cellClass += " bg-red-400/20 border-red-400/50 pulse-glow";
    } else if (isCurrent) {
      cellClass += " bg-blue-400/30 ring-2 ring-blue-400 pulse-glow";
    } else if (isPath) {
      cellClass += " bg-yellow-400/20";
    } else {
      cellClass += " bg-white/5 hover:bg-white/10";
    }
    
    return (
      <div key={`${x}-${y}`} className={cellClass}>
        {isCurrent && (
          <div className="relative">
            <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 animate-bounce" />
            <Sparkles className="w-3 h-3 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
          </div>
        )}
        {isGoal && !isCurrent && (
          <Target className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 animate-pulse" />
        )}
        {isStart && !isCurrent && (
          <Home className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
        )}
        {isPath && !isCurrent && !isStart && !isGoal && (
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
        )}
      </div>
    );
  };

  return (
    <div className="glass rounded-2xl p-4 sm:p-6 shadow-2xl">
      <div className="flex justify-center mb-4">
        <h3 className="text-xl font-bold text-white">Wumpus World</h3>
      </div>
      <div className="flex justify-center">
        <div className="grid grid-cols-10 gap-1 border-2 border-white/30 p-3 glass-dark rounded-xl">
          {Array.from({ length: gridSize }, (_, row) => 
            Array.from({ length: gridSize }, (_, col) => 
              renderCell(col, gridSize - 1 - row)
            )
          )}
        </div>
      </div>
      <div className="mt-6 flex justify-center space-x-6 text-sm">
        <div className="flex items-center space-x-1">
          <Bot className="w-4 h-4 text-blue-400" />
          <span className="text-white/80">Wumpus</span>
        </div>
        <div className="flex items-center space-x-1">
          <Home className="w-4 h-4 text-green-400" />
          <span className="text-white/80">Start</span>
        </div>
        <div className="flex items-center space-x-1">
          <Target className="w-4 h-4 text-red-400" />
          <span className="text-white/80">Goal</span>
        </div>
      </div>
    </div>
  );
}