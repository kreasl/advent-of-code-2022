export interface Dot {
  x: number;
  y: number;
}

export type Vec = Dot;

export enum Dir {
  R = 'R',
  L = 'L',
  U = 'U',
  D = 'D',
}

export const dirShifts: Record<Dir, Vec> = {
  [Dir.L]: { x: -1, y: 0 },
  [Dir.R]: { x: 1, y: 0 },
  [Dir.U]: { x: 0, y: 1 },
  [Dir.D]: { x: 0, y: -1 },
};

export const reverseDirs: Record<Dir, Dir> = {
  [Dir.L]: Dir.R,
  [Dir.R]: Dir.L,
  [Dir.U]: Dir.D,
  [Dir.D]: Dir.U,
}

export interface Move {
  dir: Dir;
  distance: number;
}

export interface Segment {
  a: Dot,
  b: Dot,
}

export type Consumer<T, U> = (
  err: Error,
  x: T | Highland.Nil,
  push: (err: Error | null, value?: U | Highland.Nil) => void,
  next: () => void,
) => void;
