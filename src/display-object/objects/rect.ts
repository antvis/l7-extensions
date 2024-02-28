import {
  DisplayObjectConfig,
  ICSSStyleDeclaration,
  Rect,
  RectStyleProps,
} from '@antv/g';
import { IMapService } from '@antv/l7-core';
import { IL7GDisplayObject } from '../interface';
import { getNumber } from '../utils';

export class GRect
  extends Rect
  implements IL7GDisplayObject<RectStyleProps, [number, number]>
{
  originStyle: RectStyleProps & ICSSStyleDeclaration<RectStyleProps>;
  coordinates: [number, number];

  constructor(config: DisplayObjectConfig<RectStyleProps>) {
    super(config);
    this.coordinates = [getNumber(this.style.x), getNumber(this.style.y)];
    this.originStyle = this.style;
    this.style = new Proxy(this.originStyle, {
      get: (target, key: keyof RectStyleProps) => {
        if (key === 'x' || key === 'y') {
          return this.coordinates[key === 'x' ? 0 : 1];
        }
        return target[key];
      },
      set: (target, key: keyof RectStyleProps, value: any) => {
        if (key === 'x' || key === 'y') {
          const index = key === 'x' ? 0 : 1;
          const newValue = getNumber(value);
          this.coordinates[index] = newValue;
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
    const { x, y } = mapService.lngLatToContainer(this.coordinates);
    this.originStyle.x = x;
    this.originStyle.y = y;
  }
}
