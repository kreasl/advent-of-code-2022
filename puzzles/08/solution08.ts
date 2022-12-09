import * as H from 'highland';
import { readFile, output } from '../../helpers/streams';
import { parseIntArray, transpose } from '../../helpers/arrays';
import { getLineVisibility } from './helpers';

const input = readFile('input.txt')
  .split().compact();

(async () => {
  const grid = await input
    .map((str) => str.split(''))
    .map(parseIntArray)
    .collect()
    .toPromise(Promise);

  /*  Part 1 */
  const hHeights = grid
    .map((line, y) => getLineVisibility(line, (x) => ({ y, x })));
  const vHeights = transpose(grid)
    .map((line, x) => getLineVisibility(line, (y) => ({ y, x })));

  const visible = H([...hHeights, ...vHeights])
    .flatten()
    .uniqBy(({ x: x1, y: y1}, { x: x2, y: y2 }) => x1 === x2 && y1 === y2)
    .sortBy(({ x: x1, y: y1}, { x: x2, y: y2 }) => (y1 - y2) || (x1 - x2))
    .reduce(0, (sum) => sum += 1);



  output(visible);
}) ();
