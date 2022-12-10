import * as H from 'highland';
import Stream = Highland.Stream;
import { readFile, output, batchWithHead } from '../../helpers/streams';
import { getDirs, getSize, parseCommand, updatePath } from './helpers';

const input = readFile('puzzles/07/input.txt')
  .split().compact();

const TOTAL_SPACE = 70000000;
const REQUIRED_SPACE = 30000000;

const commands = batchWithHead(
  input,
  (str) => str[0] === '$',
)
  .map(parseCommand);

const sizes: Stream<{ [dir: string]: number }> = commands
  .reduce(
    { '': 0 },
    (() => {
      let path = null;

      return (acc, cmd) => {
        const newAcc = { ...acc };

        switch (cmd.type) {
          case 'cd':
            path = updatePath(path, cmd.arg);
            break;
          case 'ls':
            if (path === null) {
              throw new Error('Path is not defined');
            }

            const dirs = getDirs(cmd.output);
            const size = getSize(cmd.output);

            dirs.forEach((dir) => {
              const dirPath = `${path}/${dir}`;
              newAcc[dirPath] = newAcc[dirPath] || 0;
            });

            const pathParts = path.split('/');
            pathParts.forEach((_, idx) => {
              const dirPath = pathParts.slice(0, idx + 1).join('/');
              newAcc[dirPath] += size;
            });

            break;
          default:
            throw new Error('Unsupported command');
        }

        return newAcc;
      }
    }) (),
  );

// PART 1
// ******
// const answer = sizes
//   .flatMap(Object.values)
//   .flatten()
//   .filter((x) => x <= 100000)
//   .reduce1((a, b) => a + b);

// PART 2
// ******
const answer = sizes
  .consume((err, s, push, next) => {
    if (H.isNil(s)) {
      push(null, s);
      return;
    }

    const freeSpace = TOTAL_SPACE - s[''];
    const desiredSpace = REQUIRED_SPACE - freeSpace;

    if (desiredSpace <= 0) {
      throw new Error('No cleaning required');
    }

    Object.values(s)
      .filter((size) => size >= desiredSpace)
      .forEach((size) => {
        push(null, size);
        next();
      })
  })
  .sortBy((a: number, b: number) => a - b)
  .head();

output(answer);
