import { IEventTarget } from '@antv/g';
import { IMapService } from '@antv/l7';

type Listener = (...args: any[]) => void;

const MOUSE_EVENT_SET = new Set([
  'pointerdown',
  'pointerup',
  'pointerupoutside',
  'pointertap',
  'pointerover',
  'pointerenter',
  'pointerleave',
  'pointerout',
  'mousedown',
  'rightdown',
  'mouseup',
  'rightup',
  'mouseupoutside',
  'rightupoutside',
  'click',
  'mousemove',
  'mouseover',
  'mouseout',
  'mouseenter',
  'mouseleave',
  'wheel',
  'touchstart',
  'touchend',
  'touchendoutside',
  'touchmove',
  'touchcancel',
]);

export function proxyEventListener(
  _this: IEventTarget,
  mapService: IMapService,
) {
  const getStoreListener = (() => {
    const listenerMap = new WeakMap<Listener, Listener>();
    return (listener: Listener) => {
      let result = listenerMap.get(listener);
      if (!result) {
        result = (evt: any) => {
          if (MOUSE_EVENT_SET.has(evt.type)) {
            const { x, y } = evt.canvas;
            const { lng, lat } = mapService.containerToLngLat([x, y]);
            evt.coordinates = [lng, lat];
          }
          listener(evt);
        };
        listenerMap.set(listener, result);
      }
      return result;
    };
  })();

  const addEventListener = _this.addEventListener;
  _this.addEventListener = function (type, listener, options) {
    return addEventListener.call(
      _this,
      type,
      // @ts-ignore
      getStoreListener(listener),
      options,
    );
  };
  const removeEventListener = _this.removeEventListener;
  _this.removeEventListener = function (type, listener, options) {
    return removeEventListener.call(
      _this,
      type,
      // @ts-ignore
      getStoreListener(listener),
      options,
    );
  };
}
