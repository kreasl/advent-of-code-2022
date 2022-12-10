import * as fs from 'fs';
import * as H from 'highland';
import Stream = Highland.Stream;
import { Dot, PowerDot, Smb } from './interface';

export const readFile = H.wrapCallback(fs.readFile);

export const output = <T>(stream: Stream<T> | any): void => {
  process.stdout.write("\u001b[2J\u001b[0;0H");

  if (H.isStream(stream)) {
    stream
      .map((x) => typeof x === 'string' ? x : JSON.stringify(x))
      .intersperse('\n')
      .concat(H(['\n'])) // yarn output workaround
      .pipe(process.stdout);
  } else {
    console.log(stream);
  }
}

export const draw = (stream: Stream<number | Dot | PowerDot>, width: number, height: number): void => {
  const EMPTY = '·';
  const NON_EMPTY = '▓';

  process.stdout.write("\u001b[2J\u001b[0;0H");

  stream
    .map((p): Smb => {
      if (p.hasOwnProperty('x') && p.hasOwnProperty('y')) {
        const d = p as Dot;

        const pos = d.y * width + d.x + 1
        const char = p.hasOwnProperty('strength') ? `${(p as PowerDot).power}` : NON_EMPTY;

        return { pos, char };
      }

      return { pos: p as number, char: NON_EMPTY };
    })
    .sortBy((a, b) => a.pos - b.pos)
    .uniq()
    .consume((() => {
      const size = width * height;

      let pos = 0;

      return (err, smb, push, next) => {
        if (H.isNil(smb)) {
          push(null, Array(size - pos - 1).fill(EMPTY));
          push(null, H.nil);
          return;
        }
        if (pos >= size) {
          next();
          return;
        }

        if (pos !== smb.pos) push(null, Array(smb.pos - pos - 1).fill(EMPTY));
        push(null, smb.char);
        pos = smb.pos;
        next();
      }
    })())
    .flatten()
    .batch(width)
    .map((arr) => arr.join(''))
    .intersperse('\n')
    .concat(H(['\n'])) // yarn output workaround
    .pipe(process.stdout);
};

export const takeWhile = <T>(stream: Stream<T>, condition: Function): Stream<T> => {
  let conditionIsMet = true;

  return stream
    .consume((_, x, push, next) => {
      if (conditionIsMet && condition(x)) {
        push(null, x);
      } else {
        conditionIsMet = false;
      }

      if (H.isNil(x)) {
        push(null, x);
      } else {
        next();
      }
    });
}

export const dropWhile = <T>(stream: Stream<T>, condition: Function): Stream<T> => {
  let conditionIsMet = false;

  return stream
    .consume((_, x, push, next) => {
      if (conditionIsMet || !condition(x)) {
        conditionIsMet = true;
        push(null, x);
      }

      if (!H.isNil(x)) next();
    });
}

export const getTuples = <T>(stream: Stream<T>, size: number): Stream<Array<T>> => {
  const tail = Array(size - 1)
    .fill(0)
    .map((_, sz) => stream.observe().drop(sz))
    .reverse();

  return stream
    .drop(size - 1)
    .zipAll(H(tail))
    .map((arr) => arr.reverse());
}

export const batchWithHead = <T>(stream: Stream<T>, condition: Function): Stream<T[]> => {
  let acc: T[] = [];

  return stream.consume((err, x, push, next) => {
    if (H.isNil(x)) {
      if (acc.length) push(null, acc);

      push(null, H.nil);

      return;
    }

    if (!condition(x)) {
      acc.push(x);

      next();

      return;
    }

    if (acc.length) {
      push(null, acc);
    }

    acc = [x];

    next();
  });
};
