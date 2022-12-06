import { getIntersection, splitArrayToBatches } from '../../helpers/arrays';
import { output, readFile } from '../../helpers/streams';

const PRIORITY = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const getPriority = (ch) => PRIORITY.indexOf(ch) + 1;

const answer = readFile('input.txt')
  .split().compact()
  .map((s) => s.split(''))
  .map((arr) => splitArrayToBatches(arr, arr.length / 2))
  .map((arr) => arr.map((half) => half.sort()))
  .map((tuple) => getIntersection(tuple)[0])
  .map(getPriority)
  .reduce1((a: number, b: number) => a + b);

output(answer);
