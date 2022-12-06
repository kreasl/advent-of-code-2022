import { getIntersection } from '../../helpers/arrays';
import { readFile } from '../../helpers/streams';

const output = process.stdout;

const PRIORITY = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

const getPriority = (ch) => PRIORITY.indexOf(ch) + 1;

readFile('input.txt')
  .split().compact()
  .map((s) => s.split(''))
  .map((arr) => arr.sort())
  .batch(3)
  .map((tuple) => getIntersection(tuple)[0])
  .map(getPriority)
  .reduce1((a: number, b: number) => a + b)
  .map(JSON.stringify)
  .intersperse('\n')
  .pipe(output);

