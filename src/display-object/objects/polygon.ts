import {
  DisplayObjectConfig,
  ICSSStyleDeclaration,
  Polygon,
  PolygonStyleProps,
} from '@antv/g';
import { IMapService } from '@antv/l7-core';
import { IL7GDisplayObject } from '../interface';

export class GPolygon
  extends Polygon
  implements IL7GDisplayObject<PolygonStyleProps, PolygonStyleProps['points']>
{
  originStyle: PolygonStyleProps & ICSSStyleDeclaration<PolygonStyleProps>;
  coordinates: PolygonStyleProps['points'];

  constructor(config: DisplayObjectConfig<PolygonStyleProps>) {
    super(config);
    this.coordinates = this.style.points;
    this.originStyle = this.style;
    this.style = new Proxy(this.originStyle, {
      get: (target, key: keyof PolygonStyleProps) => {
        if (key === 'points') {
          return this.coordinates;
        }
        return target[key];
      },
      set: (target, key: keyof PolygonStyleProps, value: any) => {
        if (key === 'points') {
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
    const newPoints = this.coordinates.map((position) => {
      if (position.length === 2) {
        const { x, y } = mapService.lngLatToContainer(position);
        return [x, y] as [number, number];
      }
      return position;
    });
    this.originStyle.points = newPoints;
  }
}
