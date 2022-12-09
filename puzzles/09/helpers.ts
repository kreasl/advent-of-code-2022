import * as H from 'highland';
import { Consumer, Dir, dirShifts, Dot, Move, reverseDirs, Segment, Vec } from './interface';
import { getIntersection } from '../../helpers/arrays';

export const parseMove = (s: string): Move => {
  const [dir, distance] = s.split(' ');

  return { dir: dir as Dir, distance: parseInt(distance) };
};

export const composeVectors = ({ x: ax, y: ay }: Dot | Vec, { x: bx, y: by }: Vec): Dot | Vec => {
  return {
    x: ax + bx,
    y: ay + by,
  };
};

export const applyVector = (head: Dot, { dir, distance }: Move): Dot => {

  const { x: shiftX, y: shiftY } = dirShifts[dir];

  return { x: head.x + shiftX * distance, y: head.y + shiftY * distance }
}

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

export const isStraight = (rope: Dot[], dir: Dir): boolean => {
  const shift = dirShifts[dir];

  return rope.slice(1).every((knot, idk) => {
    return !compareDots(composeVectors(knot, shift), rope[idk]);
  })
};

export const getNextShift = (head: Dot, tail: Dot): Vec => {
  const offset = composeVectors(head, reverseVector(tail));

  if (Math.abs(offset.x) < 2 && Math.abs(offset.y) < 2) return null;

  return {
    x: Math.abs(offset.x) ? offset.x / Math.abs(offset.x) : 0,
    y: Math.abs(offset.y) ? offset.y / Math.abs(offset.y) : 0,
  };
};

export const getMoveConsumer = (ropeLength: number): Consumer<Move, Segment> => {
  let rope: Dot[] = Array(ropeLength + 1).fill(0)
    .map(() => ({ x: 0, y: 0 }));

  return (err, move: Move | Highland.Nil, push, next) => {
    if (H.isNil(move)) {
      push(null, { a: { x: 0, y: 0 }, b: { x: 0, y: 0 } });
      push(null, H.nil);
      return;
    }

    const dots: Dot[] = [];

    const { dir, distance } = move;
    let initialSteps = 0;
    do {
      let shift = dirShifts[dir];
      rope[0] = composeVectors(rope[0], shift);

      let idk = 1;
      while (idk < rope.length && shift) {
        shift = getNextShift(rope[idk - 1], rope[idk]);
        if (shift) rope[idk] = composeVectors(rope[idk], shift);
        idk++;
      }

      if (shift) {
        dots.push(rope.at(-1));
      }

      initialSteps++;
    } while (
      initialSteps < distance
      && !isStraight(rope, dir)
    );

    if (initialSteps < distance) {
      const tail = rope.at(-1);
      const finalMove = { dir, distance: distance - initialSteps }
      rope = rope.map((knot) => applyVector(knot, finalMove));
      push(null, { a: tail, b: rope.at(-1) });
    }

    dots.forEach((dot) => push(null, { a: dot, b: dot }));

    next();
  };
};
