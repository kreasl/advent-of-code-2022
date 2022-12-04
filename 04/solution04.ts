import * as H from 'highland';
import * as fs from 'fs';
import { isOverlapping } from '../helpers';

const input = fs.createReadStream('input.txt');
const output = process.stdout;

H<string>(input)
  .split().compact()
  .map((str) => str.split(','))
  .map((pair) => pair.map((part) => part.split('-')))
  .map((pair) => pair.map((range) => range.map((x) => parseInt(x))))
  .filter(([r1, r2]) => isOverlapping(r1, r2, false))
  .reduce(0, (sum) => sum + 1)
  .map(JSON.stringify)
  .intersperse('\n')
  .pipe(output);

