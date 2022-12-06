import { parseIntArray, calculateArraySum } from '../../helpers/arrays';
import { readFile } from '../../helpers/streams';

const output = process.stdout;

readFile('input.txt')
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

