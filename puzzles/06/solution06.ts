import { getTuples, readFile, takeWhile } from '../../helpers/streams';

const TUPLE_SIZE = 14;

const output = process.stdout;

const input = readFile('input.txt')
  .split().compact()
  .splitBy('');

const tuples = getTuples(input, TUPLE_SIZE)

const noise = takeWhile(
  tuples,
  (arr) => (new Set(arr)).size !== arr.length
);

noise
  .collect()
  .map((arr) => arr.length + TUPLE_SIZE)
  .map(JSON.stringify)
  .intersperse('\n')
  .pipe(output);
