import {
  DisplayObjectConfig,
  ICSSStyleDeclaration,
  Text,
  TextStyleProps,
} from '@antv/g';
import { IMapService } from '@antv/l7-core';
import { proxyEventListener } from '../../utils';
import { IL7GDisplayObject } from '../interface';
import { getNumber } from '../utils';

export class GText
  extends Text
  implements IL7GDisplayObject<TextStyleProps, [number, number]>
{
  originStyle: TextStyleProps & ICSSStyleDeclaration<TextStyleProps>;
  coordinates: [number, number];
  mapService?: IMapService;

  constructor(config: DisplayObjectConfig<TextStyleProps>) {
    super(config);
    this.coordinates = [getNumber(this.style.x), getNumber(this.style.y)];
    this.originStyle = this.style;
    this.style = new Proxy(this.originStyle, {
      get: (target, key: keyof TextStyleProps) => {
        if (key === 'x' || key === 'y') {
          return this.coordinates[key === 'x' ? 0 : 1];
        }
        return target[key];
      },
      set: (target, key: keyof TextStyleProps, value: any) => {
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
    if (!this.mapService) {
      this.mapService = mapService;
      proxyEventListener(this, this.mapService);
    }
    const { x, y } = mapService.lngLatToContainer(this.coordinates);
    this.originStyle.x = x;
    this.originStyle.y = y;
  }
}
