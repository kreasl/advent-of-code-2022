import Stream = Highland.Stream;
import { getTuples, readFile, output, takeWhile } from '../../helpers/streams';

const TUPLE_SIZE = 14;

const input = readFile('input.txt')
  .split().compact()
  .splitBy('');

const tuples = getTuples(input, TUPLE_SIZE)

const noise = takeWhile(
  tuples,
  (arr) => (new Set(arr)).size !== arr.length
);

const answer: Stream<number> = noise
  .collect()
  .map((arr) => arr.length + TUPLE_SIZE);

output(answer)
