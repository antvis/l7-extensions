import {
  Circle,
  CircleStyleProps,
  DisplayObjectConfig,
  ICSSStyleDeclaration,
} from '@antv/g';
import { IMapService } from '@antv/l7-core';
import { IL7GDisplayObject } from '../interface';
import { getNumber } from '../utils';

export class GCircle
  extends Circle
  implements IL7GDisplayObject<CircleStyleProps, [number, number]>
{
  originStyle: CircleStyleProps & ICSSStyleDeclaration<CircleStyleProps>;
  coordinates: [number, number];

  constructor(config: DisplayObjectConfig<CircleStyleProps>) {
    super(config);
    this.coordinates = [getNumber(this.style.cx), getNumber(this.style.cy)];
    this.originStyle = this.style;
    this.style = new Proxy(this.originStyle, {
      get: (target, key: keyof CircleStyleProps) => {
        if (key === 'cx' || key === 'cy') {
          return this.coordinates[key === 'cx' ? 0 : 1];
        }
        return target[key];
      },
      set: (target, key: keyof CircleStyleProps, value: any) => {
        if (key === 'cx' || key === 'cy') {
          const index = key === 'cx' ? 0 : 1;
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
    this.originStyle.cx = x;
    this.originStyle.cy = y;
  }
}
