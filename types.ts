
export type Player = 'X' | 'O';
export type SquareValue = Player | null;

export type GameMode = 'VS_AI' | 'VS_HUMAN';

export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export type BoardSize = 3 | 4 | 5;

export type Theme = 'DARK' | 'LIGHT';

export interface GameState {
  board: SquareValue[];
  isXNext: boolean;
  winner: Player | 'Draw' | null;
  winningLine: number[] | null;
  history: SquareValue[][];
}

export interface AIMoveResponse {
  move: number;
  reasoning: string;
}

export interface MoveLogEntry {
  player: Player;
  index: number;
  reasoning?: string;
  timestamp: number;
}

export enum GameStatus {
  IDLE = 'IDLE',
  PLAYING = 'PLAYING',
  THINKING = 'THINKING', // AI is thinking
  FINISHED = 'FINISHED'
}
