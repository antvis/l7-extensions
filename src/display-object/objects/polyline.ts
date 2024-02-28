import {
  DisplayObjectConfig,
  ICSSStyleDeclaration,
  Polyline,
  PolylineStyleProps,
} from '@antv/g';
import { IMapService } from '@antv/l7-core';
import { IL7GDisplayObject } from '../interface';

// @ts-ignore
export class GPolyline
  extends Polyline
  implements
    IL7GDisplayObject<PolylineStyleProps, PolylineStyleProps['points']>
{
  originStyle: PolylineStyleProps & ICSSStyleDeclaration<PolylineStyleProps>;
  coordinates: PolylineStyleProps['points'];

  constructor(config: DisplayObjectConfig<PolylineStyleProps>) {
    super(config);
    this.coordinates = this.style.points;
    // @ts-ignore
    this.originStyle = this.style;
    // @ts-ignore
    this.style = new Proxy(this.originStyle, {
      get: (target, key: keyof PolylineStyleProps) => {
        if (key === 'points') {
          return this.coordinates;
        }
        return target[key];
      },
      set: (target, key: keyof PolylineStyleProps, value: any) => {
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
