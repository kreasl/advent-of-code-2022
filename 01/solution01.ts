import * as H from 'highland';
import * as fs from 'fs';

const input = fs.createReadStream('input.txt');
const output = process.stdout;

const parseIntArray = (arr: string[]) => arr.map((s) => parseInt(s));

const calculateArraySum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

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
