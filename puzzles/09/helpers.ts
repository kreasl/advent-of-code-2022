import * as H from 'highland';
import { Dir, dirShifts, Move } from './interface';
import { Producer, Dot, Segment, Vec } from '../../helpers/interface';
import { compareDots, composeVectors, reverseVector } from '../../helpers/geometry';

export const parseMove = (s: string): Move => {
  const [dir, distance] = s.split(' ');

  return { dir: dir as Dir, distance: parseInt(distance) };
};

export const applyMove = (head: Dot, { dir, distance }: Move): Dot => {

  const { x: shiftX, y: shiftY } = dirShifts[dir];

  return { x: head.x + shiftX * distance, y: head.y + shiftY * distance }
}

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

export const getMoveConsumer = (ropeLength: number): Producer<Move, Segment> => {
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
      rope = rope.map((knot) => applyMove(knot, finalMove));
      push(null, { a: tail, b: rope.at(-1) });
    }

    dots.forEach((dot) => push(null, { a: dot, b: dot }));

    next();
  };
};
