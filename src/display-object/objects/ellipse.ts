import {
  DisplayObjectConfig,
  Ellipse,
  EllipseStyleProps,
  ICSSStyleDeclaration,
} from '@antv/g';
import { IMapService } from '@antv/l7-core';
import { IL7GDisplayObject } from '../interface';
import { getNumber } from '../utils';

export class GEllipse
  extends Ellipse
  implements IL7GDisplayObject<EllipseStyleProps, [number, number]>
{
  originStyle: EllipseStyleProps & ICSSStyleDeclaration<EllipseStyleProps>;
  coordinates: [number, number];

  constructor(config: DisplayObjectConfig<EllipseStyleProps>) {
    super(config);
    this.coordinates = [getNumber(this.style.cx), getNumber(this.style.cy)];
    this.originStyle = this.style;
    this.style = new Proxy(this.originStyle, {
      get: (target, key: keyof EllipseStyleProps) => {
        if (key === 'cx' || key === 'cy') {
          return this.coordinates[key === 'cx' ? 0 : 1];
        }
        return target[key];
      },
      set: (target, key: keyof EllipseStyleProps, value: any) => {
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
