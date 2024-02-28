import { BaseStyleProps, DisplayObject } from '@antv/g';
import { IMapService } from '@antv/l7-core';

export interface IL7GDisplayObject<
  T extends BaseStyleProps = BaseStyleProps,
  C = any,
> extends DisplayObject<T> {
  originStyle: T;
  coordinates: C;
  syncPosition(mapService: IMapService): void;
}
