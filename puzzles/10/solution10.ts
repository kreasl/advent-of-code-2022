import { draw, output, readFile } from '../../helpers/streams';
import { getCrtProducer, getStrengthReadingsProducer, getTimelineProducer, parseCommand } from './helpers';

const READING_THRESHOLD = 40;
const LINES_NO = 6;
const LINE_SIZE = 40;

const input = readFile('input.txt')
  .split().compact();

const commands = input
  .map(parseCommand);

const timeline = commands
  .consume(getTimelineProducer());

const answer = timeline
  .consume(getCrtProducer(LINE_SIZE, LINES_NO));

// output(answer);
draw(answer, LINE_SIZE, LINES_NO);
