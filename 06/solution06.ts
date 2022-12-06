import * as H from 'highland';
import * as fs from 'fs';
import { getTuples, takeWhile } from '../helpers';

const TUPLE_SIZE = 14;

const inputStream = fs.createReadStream('input.txt');
const output = process.stdout;

const input = H<string>(inputStream)
  .split().compact()
  .splitBy('');

const tuples = getTuples(input, TUPLE_SIZE)

const noise = takeWhile(
    tuples,
    (arr) => (new Set(arr)).size !== arr.length
  )
  .collect()
  .map((arr) => arr.length + TUPLE_SIZE);

noise
  .map(JSON.stringify)
  .intersperse('\n')
  .pipe(output);
