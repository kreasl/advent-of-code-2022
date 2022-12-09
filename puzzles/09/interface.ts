import { Vec } from '../../helpers/interface';

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

export interface Move {
  dir: Dir;
  distance: number;
}
