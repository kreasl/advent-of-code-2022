import { batchWithHead, output, readFile } from '../../helpers/streams';
import { calculateArraySum, transpose } from '../../helpers/arrays';
import { getBasesProducer, getRoundsProducer, monkeysProducer } from './producers';

const ROUNDS = 10000;
const RELIEF_DIVIDER = 1;

const input = readFile('puzzles/11/input.txt')
  .split().compact();

const bases = input
  .observe()
  .filter((str) => str.trim().startsWith('Test'))
  .consume(getBasesProducer());

const monkeys = batchWithHead(
  input,
  (str) => str.startsWith('Monkey'),
)
  .consume(monkeysProducer);

const rounds = monkeys
  .collect()
  .zip(bases)
  .consume(getRoundsProducer(ROUNDS, RELIEF_DIVIDER));

const answer = rounds
  // .observe()
  .reduce1(
    (a1: number[], a2: number[]) => transpose([a1, a2]).map(calculateArraySum),
  )
  .flatten()
  .sortBy((a, b) => b - a)
  .take(2)
  .reduce1((a: number, b: number) => a * b);

// output(rounds);
output(answer);
