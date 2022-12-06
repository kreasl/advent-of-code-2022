import { getIntersection, splitArrayToBatches } from '../../helpers/arrays';
import { readFile } from '../../helpers/streams';

const output = process.stdout;

const PRIORITY = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

const getPriority = (ch) => PRIORITY.indexOf(ch) + 1;

readFile('input.txt')
  .split().compact()
  .map((s) => s.split(''))
  .map((arr) => splitArrayToBatches(arr, arr.length / 2))
  .map((arr) => arr.map((half) => half.sort()))
  .map((tuple) => getIntersection(tuple)[0])
  .map(getPriority)
  .reduce1((a: number, b: number) => a + b)
  .map(JSON.stringify)
  .intersperse('\n')
  .pipe(output);

