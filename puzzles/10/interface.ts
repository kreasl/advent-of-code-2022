export enum CmdType {
  NOOP = 'noop',
  ADDX = 'addx',
}

export interface Cmd {
  type: CmdType,
  arg?: number,
}

export const cmdTime = {
  [CmdType.NOOP]: 1,
  [CmdType.ADDX]: 2,
}

export class Time {
  constructor(
    public readonly ticks: number,
  ) {}
}

export type Rec = Time | number;
