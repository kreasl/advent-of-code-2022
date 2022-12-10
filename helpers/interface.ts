export type Producer<T, U> = (
  err: Error,
  x: T | Highland.Nil,
  push: (err: Error | null, value?: U | Highland.Nil) => void,
  next: () => void,
) => void;

export interface Dot {
  x: number;
  y: number;
}

export interface PowerDot extends Dot {
  power: number;
}

export type Vec = Dot;

export interface Segment {
  a: Dot,
  b: Dot,
}

export interface Smb {
  pos: number;
  char: string;
}
