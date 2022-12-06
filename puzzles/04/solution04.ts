import { isOverlapping } from '../../helpers/arrays';
import { readFile } from '../../helpers/streams';

const output = process.stdout;

readFile('input.txt')
  .split().compact()
  .map((str) => str.split(','))
  .map((pair) => pair.map((part) => part.split('-')))
  .map((pair) => pair.map((range) => range.map((x) => parseInt(x))))
  .filter(([r1, r2]) => isOverlapping(r1, r2, false))
  .reduce(0, (sum) => sum + 1)
  .map(JSON.stringify)
  .intersperse('\n')
  .pipe(output);

