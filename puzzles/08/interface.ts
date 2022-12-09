export interface Belt<T> {
  top: T[],
  bottom: T[],
  left: T[]
  right: T[],
}

export interface Cell {
  x: number;
  y: number;
}

export interface Peak {
  h: number;
  d: number;
}
