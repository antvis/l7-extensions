import {
  DisplayObjectConfig,
  ICSSStyleDeclaration,
  Line,
  LineStyleProps,
} from '@antv/g';
import { IMapService } from '@antv/l7-core';
import { proxyEventListener } from '../../utils';
import { IL7GDisplayObject } from '../interface';
import { getNumber } from '../utils';

export class GLine
  extends Line
  implements
    IL7GDisplayObject<LineStyleProps, [[number, number], [number, number]]>
{
  originStyle: LineStyleProps & ICSSStyleDeclaration<LineStyleProps>;
  coordinates: [[number, number], [number, number]];
  mapService?: IMapService;

  constructor(config: DisplayObjectConfig<LineStyleProps>) {
    super(config);
    this.coordinates = [
      [getNumber(this.style.x1), getNumber(this.style.y1)],
      [getNumber(this.style.x2), getNumber(this.style.y2)],
    ];
    this.originStyle = this.style;
    this.style = new Proxy(this.originStyle, {
      get: (target, key: keyof LineStyleProps) => {
        if (['x1', 'y1', 'x2', 'y2'].includes(key)) {
          const position =
            key === 'x1' || key === 'y1'
              ? this.coordinates[0]
              : this.coordinates[1];
          return position[key === 'x1' || key === 'x2' ? 0 : 1];
        }
        return target[key];
      },
      set: (target, key: keyof LineStyleProps, value: any) => {
        if (['x1', 'y1', 'x2', 'y2'].includes(key)) {
          const position =
            key === 'x1' || key === 'y1'
              ? this.coordinates[0]
              : this.coordinates[1];
          position[key === 'x1' || key === 'x2' ? 0 : 1] = getNumber(value);
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
    if (!this.mapService) {
      this.mapService = mapService;
      proxyEventListener(this, this.mapService);
    }
    const { x: x1, y: y1 } = mapService.lngLatToContainer(this.coordinates[0]);
    const { x: x2, y: y2 } = mapService.lngLatToContainer(this.coordinates[1]);
    this.originStyle.x1 = x1;
    this.originStyle.y1 = y1;
    this.originStyle.x2 = x2;
    this.originStyle.y2 = y2;
  }
}
