import { parseIntArray, calculateArraySum } from '../../helpers/arrays';
import { output, readFile } from '../../helpers/streams';

const answer = readFile('puzzles/01/input.txt')
  .splitBy('\n\n')
  .map((str) => str.split('\n'))
  .map(parseIntArray)
  .map(calculateArraySum)
  .sortBy((a, b) => b - a)
  .batch(3)
  .map(calculateArraySum)
  .head();

output(answer);
