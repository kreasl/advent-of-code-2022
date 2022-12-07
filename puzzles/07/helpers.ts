import { Command } from './interface';

export const parseCommand = (input: string[]) => {
  const [_, type, arg] = input[0].split(' ');

  const command: Command = { type, arg };

  const output = input.slice(1);
  if (output.length) command.output = output;

  return command;
};

export const updatePath = (path: string | null, dir: string): string => {
  if (dir === '/') return '';

  if (dir === '..') return path.split('/').slice(0, -1).join('/');

  return `${path}/${dir}`;
};

export const getSize = (output: string[]): number => {
  return output.reduce((acc, line) => {
    const [size] = line.split(' ');

    if (!isNaN(parseInt(size))) {
      return acc + parseInt(size);
    }

    return acc;
  }, 0);
};

export const getDirs = (output: string[]): string[] => {
  return output
    .map((line) => line.split(' '))
    .filter(([prefix]) => prefix === 'dir')
    .map(([_, dir]) => dir)
};
