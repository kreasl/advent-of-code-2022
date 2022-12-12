import { Dot } from '../../helpers/interface';
import { TerrainDot } from './interface';

export const getPoints = (map: string[][], point): Dot[] => {
  const points = [];

  map.forEach((line, y) => {
    line.forEach((p, x) => {
      if (p === point) points.push({ x, y });
    })
  });

  return points;
};

export const getNeighbors = (map: string[][], { x, y }: Dot): TerrainDot[] => {
  return [
    { x: x - 1, y, height: map[y][x - 1] },
    { x: x + 1, y, height: map[y][x + 1] },
    { x, y: y -1, height: (map[y - 1] || [])[x] },
    { x, y: y + 1, height: (map[y + 1] || [])[x] },
  ]
    .filter(({ height }) => height !== undefined);
}
