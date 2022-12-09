import * as H from 'highland';
import Stream = Highland.Stream;
import { Belt, Cell, Peak } from './interface';

export const getBelts = (values: number[][]): Stream<Belt<number>> => {
  return H((push) => {
    const beltsCount = Math.ceil(values.length / 2);

    Array(beltsCount).fill(true)
      .forEach((_, idx) => {
        const top = values[idx].slice(idx, values.length - idx);
        const bottom = values.at(values.length - idx - 1).slice(idx, values.length - idx);
        const left = values.slice(idx, values.length - idx).map((line) => line.at(idx));
        const right = values.slice(idx, values.length - idx).map((line) => line.at(values.length - idx - 1));

        push(null, { top, bottom, left, right });
      });

    push(null, H.nil);
  });
}

export const getBeltVisibility = (
  heights: Belt<number>,
  outerVisibility: Belt<number | boolean> | boolean,
): Belt<number | boolean> | boolean => {
  const visibility = {};

  const transform = outerVisibility === true
    ? (x) => x
    : (height, idx, dir) => {
      if (
        outerVisibility[dir][idx + 1] === false
        || outerVisibility[dir][idx + 1] >= height
      ) {
        return false;
      }

      return height;
    };

    for (const dir in heights) {
      visibility[dir] = heights[dir].map((x, idx) => transform(x, idx, dir));
    }

    if (Object.values(visibility).flat().every((x) => x === false)) return false;

  return visibility as Belt<number | boolean>;
}

export const countVisible = (visibility: Belt<number |boolean>): number => {
  const rawCount = Object.values(visibility).flat().filter((x) => x !== false).length;

  if (!rawCount) return 0;

  const { top, bottom, left, right } = visibility;

  const cornerPairs = [
    [top[0], left[0]],
    [top.at(-1), right[0]],
    [bottom[0], left.at(-1)],
    [bottom.at(-1), right.at(-1)],
  ];

  const cornerRefinement = cornerPairs.filter(([a, b]) => a !== false && b !== false).length;

  return rawCount - cornerRefinement;
}

export const getLineVisibility = (heights: number[], transform: (number) => Cell): Cell[] => {
  let height = -1;

  const bVis = heights
    .map((h, idh) => {
      if (h <= height) return null;

      height = h;

      return idh;
    })
    .filter((idh) => idh !== null)
    .map(transform);

  height = -1;

  const eVis = heights
    .slice()
    .reverse()
    .map((h, idh) => {
      if (h <= height) return null;

      height = h;

      return heights.length - idh - 1;
    })
    .filter((idh) => idh !== null)
    .map(transform);

  return [...bVis, ...eVis];
}

export const getTreeLineVisibility = (heights: number[]): number[] => {
  let length = 0;
  let stack: Peak[] = [];

  return heights.map((h, idh) => {
    let ids = stack.length - 1;
    let peak: Peak = { h, d: 1 };

    while (ids >= 0 && stack[ids].h < h) ids--;

    if (ids === -1) {
      stack = [peak];

      return idh;
    }

    const distance = stack[ids].d;

    stack = stack
      .slice(0, ids + 1)
      .map(({ h, d }) => ({ h, d: d + 1 }));
    stack.push(peak);

    return distance;
  });
};
