import * as H from 'highland';
import * as fs from 'fs';
import { getIntersection, splitArrayToBatches, print } from '../helpers';

const input = fs.createReadStream('input.txt');
const output = process.stdout;

const PRIORITY = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

const getPriority = (ch) => PRIORITY.indexOf(ch) + 1;

H<string>(input)
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

