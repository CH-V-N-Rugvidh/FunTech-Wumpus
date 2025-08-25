import React from 'react';
import { Position } from '../types';
import { Bot, Target, Home } from 'lucide-react';

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
    
    let cellClass = "w-8 h-8 sm:w-10 sm:h-10 border border-gray-300 flex items-center justify-center relative transition-all duration-300";
    
    if (isStart && !isCurrent) {
      cellClass += " bg-green-100";
    } else if (isGoal) {
      cellClass += " bg-red-100";
    } else if (isCurrent) {
      cellClass += " bg-blue-200 ring-2 ring-blue-400";
    } else if (isPath) {
      cellClass += " bg-yellow-50";
    } else {
      cellClass += " bg-gray-50";
    }
    
    return (
      <div key={`${x}-${y}`} className={cellClass}>
        {isCurrent && (
          <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 animate-pulse" />
        )}
        {isGoal && !isCurrent && (
          <Target className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
        )}
        {isStart && !isCurrent && (
          <Home className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
        )}
        {isPath && !isCurrent && !isStart && !isGoal && (
          <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
      <div className="flex justify-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Wumpus World</h3>
      </div>
      <div className="flex justify-center">
        <div className="grid grid-cols-10 gap-1 border-2 border-gray-400 p-2 bg-gray-100 rounded">
          {Array.from({ length: gridSize }, (_, row) => 
            Array.from({ length: gridSize }, (_, col) => 
              renderCell(col, gridSize - 1 - row)
            )
          )}
        </div>
      </div>
      <div className="mt-4 flex justify-center space-x-4 text-sm">
        <div className="flex items-center space-x-1">
          <Bot className="w-4 h-4 text-blue-600" />
          <span>Wumpus</span>
        </div>
        <div className="flex items-center space-x-1">
          <Home className="w-4 h-4 text-green-600" />
          <span>Start</span>
        </div>
        <div className="flex items-center space-x-1">
          <Target className="w-4 h-4 text-red-600" />
          <span>Goal</span>
        </div>
      </div>
    </div>
  );
}