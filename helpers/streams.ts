import * as fs from 'fs';
import * as H from 'highland';
import Stream = Highland.Stream;

export const readFile = H.wrapCallback(fs.readFile);

export const output = <T>(stream: Stream<T> | any): void => {
  if (H.isStream(stream)) {
    stream
      .map(JSON.stringify)
      .intersperse('\n')
      .pipe(process.stdout);
  } else {
    console.log(stream);
  }
}

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
