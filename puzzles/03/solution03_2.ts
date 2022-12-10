import { getIntersection } from '../../helpers/arrays';
import { output, readFile } from '../../helpers/streams';

const PRIORITY = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

const getPriority = (ch) => PRIORITY.indexOf(ch) + 1;

const answer = readFile('puzzles/03/input.txt')
  .split().compact()
  .map((s) => s.split(''))
  .map((arr) => arr.sort())
  .batch(3)
  .map((tuple) => getIntersection(tuple)[0])
  .map(getPriority)
  .reduce1((a: number, b: number) => a + b);

output(answer);
