import * as H from 'highland';
import Stream = Highland.Stream;

export const print = (x: any) => console.log(`\n${JSON.stringify(x)}`);

export const parseIntArray = (arr: string[]) => arr.map((s) => parseInt(s));

export const calculateArraySum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

export const splitArrayToBatches = (arr: any[], size: number): any[][] => {
  const tmp = [...arr];

  const batches = [];

  while (tmp.length) {
    batches.push(tmp.splice(0, size));
  }

  return batches;
}

export const getIntersection = <T>(arrays: Array<Array<T>>): Array<T> => {
  const intersection = [];
  let pos = new Array(arrays.length).fill(0);

  while (pos.every((p, i) => p < arrays[i].length)) {
    let i = 0;

    while (
      i < pos.length
      && arrays.every((arr, idx) => {
        return idx === i || arrays[i][pos[i]] >= arr[pos[idx]]
      })
    ) {
      i++;
    }

    if (i < pos.length) {
      pos[i]++;
    } else {
      intersection.push(arrays[0][pos[0]]);
      pos = pos.map((p) => p + 1);
    }
  }

  return intersection;
}

export const isOverlapping = ([s1, e1]: number[], [s2, e2]: number[], full = false) => {
  if (e1 < s2 || e2 < s1) return false;

  if (!full) return true;

  return (s1 - s2) * (e1 - e2) <= 0;
};

export const splitStreamBy = <T>(stream: Stream<T>, condition: Function): Stream<Stream<T>> => {
  return stream
    .reduce([[]], (groups, x) => {
      if (condition(x)) return [...groups, []];

      const body = groups.slice(0, -1);
      const tail = groups.at(-1);

      return [...body, [...tail, x]];
    })
    .consume((_, groups: Array<Array<T>>, push, next) => {
      if (Array.isArray(groups) && groups.length) {
        groups.forEach((group) => {
          if (group.length) push(null, H(group));
        });
      }

      next();
    });
}
