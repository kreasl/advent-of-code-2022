import { Dot, Segment, Vec } from './interface';
import { getIntersection } from './arrays';

export const composeVectors = ({ x: ax, y: ay }: Dot | Vec, { x: bx, y: by }: Vec): Dot | Vec => {
  return {
    x: ax + bx,
    y: ay + by,
  };
};

export const reverseVector = ({ x, y }: Vec): Vec => {
  return { x: -x, y: -y };
}

export const getSegmentCount = ({ a, b }: Segment) => {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + 1;
};

export const compareSegments = ({ a: a1, b: b1 }: Segment, { a: a2, b: b2 }: Segment): number => {
  return a1.x - a2.x || a1.y - a2.y || b1.x - b2.x || b1.y - b2.y;
};

export const compareDots = ({ x: x1, y: y1 }: Dot, { x: x2, y: y2 }: Dot): number => {
  return x1 - x2 || y1 - y2;
};

const getRangesIntersection = (r1: number[], r2: number[]): number[] => {
  const s1 = r1.sort((a, b) => a - b);
  const s2 = r2.sort((a, b) => a - b);

  const arr1 = Array(s1[1] - s1[0] + 1).fill(0)
    .map((_, sx) => s1[0] + sx);
  const arr2 = Array(s2[1] - s2[0] + 1).fill(0)
    .map((_, sx) => s2[0] + sx);

  return getIntersection([arr1, arr2]);
}

export const getSegmentsIntersection = (seg1: Segment, seg2: Segment): Dot[] => {
  if (
    seg1.b.x < seg2.a.x
    || seg1.b.y < seg2.a.y
    || seg1.a.x > seg2.b.x
    || seg1.a.y > seg2.b.y
  ) {
    return [];
  }

  const isHorizontal = (seg: Segment) => seg.a.y === seg.b.y;

  if (isHorizontal(seg1)) {
    if (isHorizontal(seg2)) {
      return getRangesIntersection([seg1.a.x, seg1.b.x], [seg2.a.x, seg2.b.x])
        .map((x) => ({ x, y: seg1.a.y }));
    } else {
      return [{ x: seg2.a.x, y: seg1.a.y }]
    }
  } else {
    if (!isHorizontal(seg2)) {
      return getRangesIntersection([seg1.a.y, seg1.b.y], [seg2.a.y, seg2.b.y])
        .map((y) => ({ x: seg1.a.x, y }));
    } else {
      return [{ x: seg1.a.x, y: seg2.a.y }]
    }
  }
};
