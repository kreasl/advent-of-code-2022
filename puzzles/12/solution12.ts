import * as H from 'highland';
import { output, readFile } from '../../helpers/streams';
import { getPathProducer } from './producers';
import { getPoints } from './helpers';
import { START } from './interface';

const input = readFile('puzzles/12/input.txt')
  .split().compact();

(async () => {
  const map = await input
    .map((str) => str.split(''))
    .collect()
    .toPromise(Promise);

  const startingPoints = [
    ...getPoints(map, START),
    ...getPoints(map, 'a'),
  ];

  const paths = H([startingPoints])
    .flatten()
    .consume(getPathProducer(map))
    .map((arr) => arr.length)
    .filter((x) => !!x)
    .sortBy((a: number, b: number) => (a - b))
    .take(1);

  output(paths);
})();
