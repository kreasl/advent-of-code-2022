import { Dot } from '../../helpers/interface';

export const START = 'S';
export const END = 'E';

export interface TerrainDot extends Dot {
  height: string;
}

export interface ConnectedDot extends TerrainDot {
  height: string;
  distance: number;
  parent: ConnectedDot | null;
}
