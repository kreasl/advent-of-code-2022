export const parseBinOp = (operationStr: string): (a: number, b: number) => number => {
  switch (operationStr) {
    case '+':
      return (a, b) => a + b;
    case '*':
      return (a, b) => a * b;
    default:
      throw new Error('Unknown operation: ' + operationStr);
  }
}

export const parseOperation = (operationStr: string): (x: number) => number => {
  const [val1, opStr, val2] = operationStr
    .split(' = ')
    .at(-1)
    .split(' ');

  const vf1 = val1 === 'old' ? (x) => x : () => parseInt(val1);
  const vf2 = val2 === 'old' ? (x) => x : () => parseInt(val2);
  const op = parseBinOp(opStr);

  return (x) => op(vf1(x), vf2(x));
}

export const parseTest = (testStr: string): (x: Record<number, number>) => boolean => {
  const value = parseInt(testStr.split(' ').at(-1));

  if (testStr.startsWith('divisible by')) return (x) => x[value] === 0;

  throw new Error('Unknown test condition');
};

export const parseDecision = (str: string): number => {
  if (str.startsWith('throw to monkey')) return parseInt(str.split(' ').at(-1));

  throw new Error('Unknown decision');
}

export const getItemRecord = (item: number, bases: number[]): Record<number, number> => {
  return bases.reduce((rec, reminder) => {
    rec[reminder] = item % reminder;

    return rec;
  }, {})
}
