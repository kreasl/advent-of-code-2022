import * as H from 'highland';
import * as fs from 'fs';
import { parseIntArray, calculateArraySum } from '../helpers';

const input = fs.createReadStream('input.txt');
const output = process.stdout;

H<string>(input)
  .splitBy('\n\n')
  .map((str) => str.split('\n'))
  .map(parseIntArray)
  .map(calculateArraySum)
  .sortBy((a, b) => b - a)
  .batch(3)
  .map(calculateArraySum)
  .map(JSON.stringify)
  .intersperse('\n')
  .head()
  .pipe(output);

