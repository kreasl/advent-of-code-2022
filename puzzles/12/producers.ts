import * as H from 'highland';
import { Dot, Producer } from '../../helpers/interface';
import { ConnectedDot, END } from './interface';
import { getNeighbors, getPoints } from './helpers';

export const getPathProducer = (map): Producer<Dot, Dot[]> => {
  return (err, start, push, next) => {
    if (H.isNil(start)) {
      push(null, H.nil);
      return;
    }

    const visited: ConnectedDot[] = [{ ...start as Dot, height: 'a', distance: 0, parent: null }];
    const end = getPoints(map, END)[0];
    let pos = 0;

    while (
      pos < visited.length
      && (visited[pos].x !== end.x || visited[pos].y !== end.y)
    ) {
      const nextSteps = getNeighbors(map, visited[pos])
        .filter((ns) => {
          const height = ns.height === END ? 'z' : ns.height;
          if (height.charCodeAt(0) > visited[pos].height.charCodeAt(0) + 1) return false;

          return !visited.some(({ x,  y}) => ns.x === x && ns.y === y);
        });

      nextSteps.forEach((ns) => visited.push({
        ...ns,
        distance: visited[pos].distance + 1,
        parent: visited[pos],
      }));

      pos++;
    }

    const path = [];
    let dot = visited[pos];
    while (dot && dot.parent) {
      path.push(dot);
      dot = dot.parent;
    }

    push(null, path.reverse());

    next();
  };
}
