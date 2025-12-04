import { SquareValue, Player } from '../types';

export function calculateWinner(squares: SquareValue[], size: number): { winner: Player | 'Draw' | null, line: number[] | null } {
  const lines: number[][] = [];
  
  // Generate Rows
  for (let i = 0; i < size; i++) {
    const row = [];
    for (let j = 0; j < size; j++) {
      row.push(i * size + j);
    }
    lines.push(row);
  }

  // Generate Columns
  for (let i = 0; i < size; i++) {
    const col = [];
    for (let j = 0; j < size; j++) {
      col.push(i + j * size);
    }
    lines.push(col);
  }

  // Generate Diagonals
  const d1 = [];
  const d2 = [];
  for (let i = 0; i < size; i++) {
    d1.push(i * size + i); // Top-left to bottom-right
    d2.push(i * size + (size - 1 - i)); // Top-right to bottom-left
  }
  lines.push(d1, d2);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const first = squares[line[0]];
    
    // Check if all squares in the line match the first one
    if (first && line.every(index => squares[index] === first)) {
      return { winner: first as Player, line: line };
    }
  }

  if (!squares.includes(null)) {
    return { winner: 'Draw', line: null };
  }

  return { winner: null, line: null };
}

export function isBoardEmpty(squares: SquareValue[]): boolean {
    return squares.every(sq => sq === null);
}