import {
  DisplayObjectConfig,
  HTML,
  HTMLStyleProps,
  ICSSStyleDeclaration,
} from '@antv/g';
import { IMapService } from '@antv/l7-core';
import { IL7GDisplayObject } from '../interface';
import { getNumber } from '../utils';

export class GHTML
  extends HTML
  implements IL7GDisplayObject<HTMLStyleProps, [number, number]>
{
  originStyle: HTMLStyleProps & ICSSStyleDeclaration<HTMLStyleProps>;
  coordinates: [number, number];

  constructor(config: DisplayObjectConfig<HTMLStyleProps>) {
    super(config);
    this.coordinates = [getNumber(this.style.x), getNumber(this.style.y)];
    this.originStyle = this.style;
    this.style = new Proxy(this.originStyle, {
      get: (target, key: keyof HTMLStyleProps) => {
        if (key === 'x' || key === 'y') {
          return this.coordinates[key === 'x' ? 0 : 1];
        }
        return target[key];
      },
      set: (target, key: keyof HTMLStyleProps, value: any) => {
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
