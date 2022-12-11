import * as H from 'highland';
import { Producer } from '../../helpers/interface';
import { Monkey } from './interface';
import { getItemRecord, parseDecision, parseOperation, parseTest } from './helpers';

export const getBasesProducer = (): Producer<string, number[]> => {
  const bases: number[] = [];

  return (err, str, push, next) => {
    if (H.isNil(str)) {
      push(null, bases);
      push(null, H.nil);
      return;
    }

    bases.push(parseInt(str.split(' ').at(-1)));
    next();
  };
}

export const monkeysProducer: Producer<string[], Monkey> = (err, arr, push, next) => {
  if (H.isNil(arr)) {
    push(null, H.nil);
    return;
  }

  const [idStr, itemsStr, operationStr, testStr, trueStr, falseStr] = arr
    .map((str) => str.split(': ').at(-1));

  const items = itemsStr.split(', ').map((it) => parseInt(it));
  const id = idStr.split(' ').at(-1).slice(0, -1);
  const operation = parseOperation(operationStr);
  const test = parseTest(testStr);
  const decisions = [parseDecision(trueStr), parseDecision(falseStr)];

  push(null, { id, items, operation, test, decisions });
  next();
};

export const getRoundsProducer = (
  rounds: number,
  reliefDivider: number,
): Producer<Array<Monkey[] | number[]>, number[]> => {
  let items: Record<number, number>[][] | null = null;
  let ops = null;
  let tests = null;
  let decisions = null;

  return (err, arr, push, next) => {
    if (H.isNil(arr)) {
      push(null, H.nil);
      return;
    }

    const [monkeys, bases] = arr;

    let counter = 0;
    items = (monkeys as Monkey[]).map(({ items }) => {
      return items.map((it) => getItemRecord(it, bases as number[]))
    });
    ops = Array(monkeys.length).fill(0);
    tests = Array(monkeys.length).fill(0);
    decisions = Array(monkeys.length).fill(0);
    monkeys.forEach((monkey) => {
      ops[monkey.id] = monkey.operation;
      tests[monkey.id] = monkey.test;
      decisions[monkey.id] = monkey.decisions;
    });

    while (counter < rounds) {
      const processed = [];

      items.forEach((mItems, idm) => {
        processed.push(mItems.length);

        mItems.forEach((record) => {
          const newRecord = { ...record };
          for (const base in newRecord) {
            const iBase = parseInt(base);

            newRecord[base] = Math.floor(
              (ops[idm](newRecord[base]) + iBase ) / reliefDivider
            ) % iBase;
          }

          const throwTo = tests[idm](newRecord) ? decisions[idm][0] : decisions[idm][1];
          items[throwTo].push(newRecord);
        });

        items[idm] = [];
      });

      push(null, processed);

      counter++;
    }

    next();
  };
}
