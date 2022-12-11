export interface Monkey {
  id: string;
  items: number[];
  operation: (x: number) => number;
  test: (x: Record<number, number>) => boolean;
  decisions: number[];
}
