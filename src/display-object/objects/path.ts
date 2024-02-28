import {
  DisplayObjectConfig,
  ICSSStyleDeclaration,
  Path,
  PathStyleProps,
} from '@antv/g';
import { IMapService } from '@antv/l7-core';
import { NormalArray, PathArray, memoize, normalizePath } from '@antv/util';
import { cloneDeep } from 'lodash-es';
import { IL7GDisplayObject } from '../interface';

const memoizedNormalizePath = memoize(normalizePath);

export class GPath
  extends Path
  implements IL7GDisplayObject<PathStyleProps, PathStyleProps['path']>
{
  originStyle: PathStyleProps & ICSSStyleDeclaration<PathStyleProps>;
  coordinates: PathStyleProps['path'];

  constructor(config: DisplayObjectConfig<PathStyleProps>) {
    super(config);
    this.coordinates = this.style.path;
    this.originStyle = this.style;
    this.style = new Proxy(this.originStyle, {
      get: (target, key: keyof PathStyleProps) => {
        if (key === 'path') {
          return this.coordinates;
        }
        return target[key];
      },
      set: (target, key: keyof PathStyleProps, value: any) => {
        if (key === 'path') {
          this.coordinates = value;
          this.emit('COORDINATES_MODIFIED', {});
        } else {
          // @ts-ignore
          target[key] = value;
        }
        return true;
      },
    });
  }

  syncPosition(mapService: IMapService) {
    const paths: NormalArray = memoizedNormalizePath(this.coordinates ?? '');
    this.originStyle.path = paths.map((path) => {
      let newPath = cloneDeep(path);
      if (path[0] === 'M' || path[0] === 'L') {
        const { x, y } = mapService.lngLatToContainer([path[1], path[2]]);
        newPath = [path[0], x, y];
      }
      if (path[0] === 'Q') {
        const { x: x1, y: y1 } = mapService.lngLatToContainer([
          path[1],
          path[2],
        ]);
        const { x, y } = mapService.lngLatToContainer([path[3], path[4]]);
        newPath = [path[0], x1, y1, x, y];
      }
      if (path[0] === 'C') {
        const { x: x1, x: y1 } = mapService.lngLatToContainer([
          path[1],
          path[2],
        ]);
        const { x: x2, y: y2 } = mapService.lngLatToContainer([
          path[3],
          path[4],
        ]);
        const { x, y } = mapService.lngLatToContainer([path[5], path[6]]);
        newPath = [path[0], x1, y1, x2, y2, x, y];
      }
      if (path[0] === 'A') {
        const { x, y } = mapService.lngLatToContainer([path[6], path[7]]);
        newPath = [path[0], path[1], path[2], path[3], path[4], path[5], x, y];
      }
      return newPath;
    }) as PathArray;
  }
}
