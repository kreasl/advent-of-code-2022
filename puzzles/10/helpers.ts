import * as H from 'highland';
import { Cmd, cmdTime, CmdType, Rec, Time } from './interface';
import { Producer } from '../../helpers/interface';

export const parseCommand = (str: string): Cmd => {
  const [type, arg] = str.split(' ');

  return {
    type: type as CmdType,
    arg: arg && parseInt(arg, 10),
  }
}

export const getTimelineProducer = (): Producer<Cmd, number | Time> => {
  let ticks = 0;
  let value = 1;

  return (err, cmd, push, next) => {
    if (H.isNil(cmd)) {
      push(null, H.nil);
      return;
    }

    ticks += cmdTime[cmd.type];

    if (cmd.arg !== undefined) {
      value += cmd.arg;
      push(null, new Time(ticks));
      push(null, value);
      ticks = 0;
    }

    next();
  }
}

export const getStrengthReadingsProducer = (readingThreshold: number, readingOffset: number): Producer<Rec, number> => {
  let counter = -readingOffset;
  let ticks = readingThreshold - readingOffset;
  let value = 1;

  return (err, rec, push, next) => {
    if (ticks >= readingThreshold) {
      counter += readingThreshold;
      ticks -= readingThreshold;
      push(null, counter * value);
    }

    if (H.isNil(rec)) {
      push(null, H.nil);
      return;
    }

    if (rec instanceof Time) {
      ticks += rec.ticks;
    } else {
      value = rec;
    }

    next();
  };
}

export const getCrtProducer = (lineSize: number, linesNo: number): Producer<Rec, number> => {
  let line = 0;
  let beamPos = 0;
  let spritePos = 1;

  return (err, rec, push, next) => {
    if (H.isNil(rec)) {
      push(null, H.nil);
      return;
    }

    if (rec instanceof Time) {
      const newBeamPos = (beamPos + rec.ticks) % lineSize;
      const newLine = (newBeamPos < beamPos) ? (line + 1) % linesNo : line;
      const sprite = [spritePos - 1, spritePos, spritePos + 1];

      if (newBeamPos < beamPos) {
        sprite.forEach((d) => {
          if (d >= beamPos && d < lineSize) {
            push(null, d + lineSize * line);
          }
          if (d < newBeamPos && d >= 0) {
            push(null, d + lineSize * newLine)
          }
        });
      } else {
        sprite.forEach((d) => {
          if (d >= beamPos && d < newBeamPos) {
            push(null, d + lineSize * line);
          }
        });
      }

      beamPos = newBeamPos;
      line = newLine;
    } else {
      spritePos = rec;
    }

    next();
  };
}
