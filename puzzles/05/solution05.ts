import * as H from 'highland';
import { parseIntArray } from '../../helpers/arrays';
import { takeWhile, dropWhile, readFile } from '../../helpers/streams';

const input = readFile('input.txt').split();
const output = process.stdout;

const parseState = (data) => {
  const parsedState = data.map((line) => line.match(/.{1,4}/g));

  const emptyState = new Array(parsedState.at(-1).length).fill([]);
  const lines = parsedState
    .slice(0, -1)
    .map((line) => line.map((x) => x[1]))
    .reverse();

  return  lines.reduce(
    (state, line) => {
      const updatedState = [...state];

      line.forEach((box, idx) => {
        if (box !== ' ') {
          updatedState[idx] = [...updatedState[idx], box]
        }
      });

      return updatedState;
    },
    emptyState,
  );
}

const parseCommand = (line) => line.match(/\d+/g);

(async () => {
  const stateStream = takeWhile(
      input.observe(),
      (str) => str !== '',
    )
    .collect()
    .map(parseState);
  const operations = dropWhile(
      input.observe(),
      (str) => str !== '',
    )
    .compact()
    .map(parseCommand)
    .map(parseIntArray)

  input.each(() => {});

  const initialState = await stateStream.toPromise(Promise);

  operations
    .reduce(initialState, (state, [amount, from, to]) => {
      const updatedState = [...state];

      updatedState[to - 1] = [
        ...updatedState[to - 1],
        ...updatedState[from - 1].slice(-amount),
      ];
      updatedState[from - 1] = [...updatedState[from - 1].slice(0, -amount)];

      return updatedState;
    })
    .consume<string>((_, state, push, next) => {
      if (Array.isArray(state) && state.length) {
        state.forEach((spot) => push(null, spot));
      }

      if (H.isNil(state)) {
        push(null, state);
      } else {
        next();
      }
    })
    .map((spot) => spot.at(-1))
    .reduce1((a, b) => a + b)
    .map(JSON.stringify)
    .intersperse('\n')
    .pipe(output);
}) ();
