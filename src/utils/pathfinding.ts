import { Position } from '../types';

export function calculateDistance(pos1: Position, pos2: Position): number {
  return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
}

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

export function getValidMove(
  current: Position, 
  goal: Position, 
  visitedPositions: Position[], 
  gridSize: number = 10,
  isCorrectAnswer: boolean = true
): Position {
  const possibleMoves = [
    { x: current.x + 1, y: current.y },
    { x: current.x - 1, y: current.y },
    { x: current.x, y: current.y + 1 },
    { x: current.x, y: current.y - 1 }
  ];
  
  // Filter valid moves within grid bounds
  const validMoves = possibleMoves.filter(
    move => move.x >= 0 && move.x < gridSize && move.y >= 0 && move.y < gridSize
  );
  
  if (validMoves.length === 0) {
    return current; // Stay in place if no moves possible
  }
  
  const currentDistance = calculateDistance(current, goal);
  
  // INVERTED LOGIC: User reports behavior is completely inverted
  // So: WRONG answers (!isCorrectAnswer) should move AWAY from goal
  //     CORRECT answers (isCorrectAnswer) should move TOWARD goal
  if (!isCorrectAnswer) {
    // For wrong answers, ALWAYS move away from goal - distance direction is first priority
    // Find all moves that increase distance from goal
    let movesAwayFromGoal = validMoves.filter(move => 
      calculateDistance(move, goal) > currentDistance
    );
    
    if (movesAwayFromGoal.length > 0) {
      // We have moves that get farther from goal - prefer unvisited ones among these
      const unvisitedAwayFromGoal = movesAwayFromGoal.filter(
        move => !visitedPositions.some(pos => pos.x === move.x && pos.y === move.y)
      );
      
      // Use unvisited moves away from goal if available, otherwise any move away from goal
      const finalCandidates = unvisitedAwayFromGoal.length > 0 ? unvisitedAwayFromGoal : movesAwayFromGoal;
      
      // Pick the farthest from goal among the candidates
      const movesWithDistance = finalCandidates.map(move => ({
        position: move,
        distance: calculateDistance(move, goal)
      }));
      movesWithDistance.sort((a, b) => b.distance - a.distance);
      return movesWithDistance[0].position;
    }
    
    // No moves increase distance - pick the one that at least doesn't decrease it
    let movesNotCloser = validMoves.filter(move => 
      calculateDistance(move, goal) >= currentDistance
    );
    
    if (movesNotCloser.length > 0) {
      // Among moves that don't get closer, pick the farthest
      const movesWithDistance = movesNotCloser.map(move => ({
        position: move,
        distance: calculateDistance(move, goal)
      }));
      movesWithDistance.sort((a, b) => b.distance - a.distance);
      return movesWithDistance[0].position;
    }
    
    // All moves get closer (edge case) - pick the one that gets closest (least bad)
    const movesWithDistance = validMoves.map(move => ({
      position: move,
      distance: calculateDistance(move, goal)
    }));
    movesWithDistance.sort((a, b) => a.distance - b.distance);
    return movesWithDistance[0].position;
    
  } else {
    // For correct answers, ALWAYS move toward goal - distance direction is first priority
    // Find all moves that reduce distance to goal
    let movesTowardGoal = validMoves.filter(move => 
      calculateDistance(move, goal) < currentDistance
    );
    
    if (movesTowardGoal.length > 0) {
      // We have moves that get closer to goal - prefer unvisited ones among these
      const unvisitedTowardGoal = movesTowardGoal.filter(
        move => !visitedPositions.some(pos => pos.x === move.x && pos.y === move.y)
      );
      
      // Use unvisited moves toward goal if available, otherwise any move toward goal
      const finalCandidates = unvisitedTowardGoal.length > 0 ? unvisitedTowardGoal : movesTowardGoal;
      
      // Pick the closest to goal among the candidates
      const movesWithDistance = finalCandidates.map(move => ({
        position: move,
        distance: calculateDistance(move, goal)
      }));
      movesWithDistance.sort((a, b) => a.distance - b.distance);
      return movesWithDistance[0].position;
    }
    
    // No moves reduce distance (shouldn't happen unless at goal)
    // Fallback: pick the move that gets closest to goal among all valid moves
    const movesWithDistance = validMoves.map(move => ({
      position: move,
      distance: calculateDistance(move, goal)
    }));
    movesWithDistance.sort((a, b) => a.distance - b.distance);
    return movesWithDistance[0].position;
  }
}
export function getNextOptimalMove(current: Position, goal: Position): Position {
  const path = calculateOptimalPath(current, goal);
  return path[0] || current;
}

// Advanced pathfinding with obstacles and strategic movement
export function getStrategicMove(
  current: Position, 
  goal: Position, 
  previousPosition: Position | null,
  gridSize: number = 10,
  isCorrectAnswer: boolean = true
): Position {
  if (isCorrectAnswer) {
    // For correct answers, move strategically towards goal
    const optimalMove = getNextOptimalMove(current, goal);
    const distance = calculateDistance(current, goal);
    
    // Add some randomness when far from goal to make game more interesting
    if (distance > 5 && Math.random() < 0.3) {
      return getRandomMove(current, previousPosition, gridSize);
    }
    
    return optimalMove;
  } else {
    // For wrong answers, move randomly but avoid going backwards
    return getRandomMove(current, previousPosition, gridSize);
  }
}