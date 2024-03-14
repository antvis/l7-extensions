import { DisplayObjectConfig, Group, GroupStyleProps } from '@antv/g';
import { IMapService } from '@antv/l7';
import { proxyEventListener } from '../../utils';
import { IL7GDisplayObject } from '../interface';

export class GGroup
  extends Group
  implements IL7GDisplayObject<GroupStyleProps, undefined>
{
  originStyle: GroupStyleProps;
  coordinates: undefined;
  mapService?: IMapService;

  constructor(config: DisplayObjectConfig<GroupStyleProps>) {
    super(config);
    this.originStyle = this.style;
    this.coordinates = undefined;
  }

  syncPosition(mapService: IMapService) {
    if (!this.mapService) {
      this.mapService = mapService;
      proxyEventListener(this, this.mapService);
    }
    this.childNodes.forEach((child) => {
      (child as IL7GDisplayObject).syncPosition?.(mapService);
    });
  }
}
