import { Position } from '../types';

export function calculateOptimalPath(start: Position, goal: Position): Position[] {
  const path: Position[] = [];
  let current = { ...start };
  
  while (current.x !== goal.x || current.y !== goal.y) {
    // Move only horizontally or vertically (like a rook in chess)
    if (current.x < goal.x) {
      current = { x: current.x + 1, y: current.y };
    } else if (current.x > goal.x) {
      current = { x: current.x - 1, y: current.y };
    } else if (current.y < goal.y) {
      current = { x: current.x, y: current.y + 1 };
    } else if (current.y > goal.y) {
      current = { x: current.x, y: current.y - 1 };
    }
    
    path.push({ ...current });
  }
  
  return path;
}

export function getRandomMove(current: Position, previousPosition: Position | null, gridSize: number = 10): Position {
  const possibleMoves = [
    { x: current.x + 1, y: current.y },
    { x: current.x - 1, y: current.y },
    { x: current.x, y: current.y + 1 },
    { x: current.x, y: current.y - 1 }
  ];
  
  // Filter valid moves within grid bounds
  let validMoves = possibleMoves.filter(
    move => move.x >= 0 && move.x < gridSize && move.y >= 0 && move.y < gridSize
  );
  
  // Remove the previous position to prevent going back
  if (previousPosition) {
    validMoves = validMoves.filter(
      move => !(move.x === previousPosition.x && move.y === previousPosition.y)
    );
  }
  
  // If no valid moves (shouldn't happen in normal cases), allow any valid move
  if (validMoves.length === 0) {
    validMoves = possibleMoves.filter(
      move => move.x >= 0 && move.x < gridSize && move.y >= 0 && move.y < gridSize
    );
  }
  
  const randomIndex = Math.floor(Math.random() * validMoves.length);
  return validMoves[randomIndex] || current;
}

export function getNextOptimalMove(current: Position, goal: Position): Position {
  const path = calculateOptimalPath(current, goal);
  return path[0] || current;
}