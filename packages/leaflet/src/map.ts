import { BaseMapWrapper } from '@antv/l7';
import { Map } from 'leaflet';
import MapService from './leaflet-layer/map';
export default class MapboxWrapper extends BaseMapWrapper<Map> {
  protected getServiceConstructor() {
    return MapService;
  }
}
