import { readFile, output } from '../../helpers/streams';

enum GST {
  ROCK = 'rock',
  PAPER = 'paper',
  SCISSORS = 'scissors',
}
enum OUT {
  WIN = 'rock',
  DRAW = 'scissors',
  LOSS = 'paper',
}

const elfG = {
  A: GST.ROCK,
  B: GST.PAPER,
  C: GST.SCISSORS,
};
const myG = {
  X: GST.ROCK,
  Y: GST.PAPER,
  Z: GST.SCISSORS,
};
const myO = {
  X: OUT.LOSS,
  Y: OUT.DRAW,
  Z: OUT.WIN,
};
const wins = {
  [GST.ROCK]: GST.SCISSORS,
  [GST.PAPER]: GST.ROCK,
  [GST.SCISSORS]: GST.PAPER,
};
const losses = {
  [GST.ROCK]: GST.PAPER,
  [GST.PAPER]: GST.SCISSORS,
  [GST.SCISSORS]: GST.ROCK,
};
const gScores = {
  [GST.ROCK]: 1,
  [GST.PAPER]: 2,
  [GST.SCISSORS]: 3,
};


const getRoundGestures = (s: string) => {
  const [elf, mine] = s.split(' ');

  const elfGesture = elfG[elf];
  const myOutcome = myO[mine];

  if (myOutcome === OUT.WIN) return [elfGesture, losses[elfGesture]];
  if (myOutcome === OUT.LOSS) return [elfGesture, wins[elfGesture]];

  return [elfGesture, elfGesture];
}
const getRoundOutcome = ([elf, mine]) => {
  const roundScore = wins[mine] === elf && 6 || elf === mine && 3 || 0;

  return roundScore + gScores[mine];
};

const answer = readFile('input.txt')
  .split()
  .compact()
  .map(getRoundGestures)
  .map(getRoundOutcome)
  .reduce1((a, b) => a + b);

output(answer);
