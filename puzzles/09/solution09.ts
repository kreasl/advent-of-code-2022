import * as H from 'highland';
import { readFile, output } from '../../helpers/streams';
import {
  parseMove,
  getMoveProducer,
} from './helpers';
import { Dot, Segment } from '../../helpers/interface';
import { compareDots, compareSegments, getSegmentCount, getSegmentsIntersection } from '../../helpers/geometry';

const input = readFile('puzzles/09/input.txt')
  .split().compact();

const ROPE_LENGTH = 9;

const moves = input
  .map(parseMove);

const segments = moves
  .consume(getMoveProducer(ROPE_LENGTH))
  .map((s: Segment) => [s, { a: s.b, b: s.a }].sort(compareSegments)[0])
  .sortBy(compareSegments);

const intersections = segments.observe()
  .collect()
  .consume((err, segments, push, next) => {
    if (H.isNil(segments)) {
      push(null, H.nil);
      return;
    }

    segments.slice(0, -1)
      .forEach((seg1, ida) => {
        segments.slice(ida + 1)
          .forEach((seg2) => {
            const dots = getSegmentsIntersection(seg1, seg2);

            dots.forEach((dot) => {
              push(null, dot);
            })
          })
      });

    next();
  })
  .sortBy(compareDots)
  .consume((() => {
    let prev = null;
    let count = 0;
    let acc = [];

    return (err, d: Dot | Highland.Nil, push, next) => {
      acc = [...acc, d].slice(-10);
      const iDots = count && (1 + Math.sqrt(1 + 8 * count)) / 2 - 1;
      if (H.isNil(d)) {
        if (iDots) push(null, iDots);
        push(null, H.nil);
        return;
      } else if (prev !== null && compareDots(prev, d)) {
        if (iDots) push(null, iDots);
        count = 0;
      }

      prev = d;
      count++;
      next();
    };
  })())
  .reduce1((a: number, b: number) => a + b);

const answer = segments
  .map(getSegmentCount)
  .reduce1((a: number, b) => a + b)
  .zip(intersections)
  .map(([a, b]) => a - b);

output(answer);

