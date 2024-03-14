import {
  DisplayObject,
  EventListenerOrEventListenerObject,
  FederatedEvent,
  Canvas as GCanvas,
  IEventTarget,
  IRenderer,
} from '@antv/g';
import { BaseLayer, CanvasLayer } from '@antv/l7';
import { proxyEventListener } from '../utils';
import './index.css';
import { MapSyncService, MapSyncServiceEvent } from './services';
import { GLayerOptions } from './types';

export class GLayer extends CanvasLayer implements IEventTarget {
  gCanvas: GCanvas | null = null;
  gRenderer: IRenderer;
  mapSyncService: MapSyncService | null = null;
  // 用于存储添加节点的回调函数数组
  protected _initialCallback: (() => void)[] = [];

  constructor(config: GLayerOptions) {
    super(config);
    this.gRenderer = config.renderer;
  }

  async buildModels() {
    this.initGCanvas();
  }

  initGCanvas() {
    const [width, height] = this.mapService.getSize();
    this.gCanvas = new GCanvas({
      width,
      height,
      renderer: this.gRenderer,
      container: this.initContainer(),
    });
    proxyEventListener(this.gCanvas, this.mapService);
    if (this.getLayerConfig().visible === false) {
      this.gCanvas.getRoot().style.visibility = 'hidden';
    }
    this.mapSyncService = new MapSyncService(
      this.gCanvas,
      this.mapService,
      this,
    );
    this.mapSyncService.on(
      MapSyncServiceEvent.IS_OUT_ZOOM_CHANGE,
      this._onIsOutZoomChange,
    );
    if (this._initialCallback.length) {
      this._initialCallback.forEach((cb) => cb());
      this._initialCallback = [];
    }
    this.injectDevtool();
  }

  setRenderer(renderer: IRenderer) {
    this.gRenderer = renderer;
    this.gCanvas?.setRenderer(renderer);
  }

  initContainer() {
    const container = document.createElement('div');
    container.classList.add('l7-g-container');
    container.style.zIndex = this.getLayerConfig().zIndex;
    this.mapService.getCanvasOverlays()!.appendChild(container);
    return container;
  }

  injectDevtool() {
    if (this.gCanvas) {
      // 接入 g-devtools
      window.__g_instances__ = window.__g_instances__
        ? window.__g_instances__.concat(this.gCanvas)
        : [this.gCanvas];
    }
  }

  destroy() {
    super.destroy();
    this.mapSyncService?.destroy();
  }

  appendChild<T extends DisplayObject>(child: T, index?: number): T {
    const callback = () => {
      return this.gCanvas!.appendChild(child, index);
    };
    if (this.gCanvas) {
      return callback();
    } else {
      this._initialCallback.push(callback);
      return child;
    }
  }

  insertBefore<T extends DisplayObject, N extends DisplayObject>(
    child: T,
    refChild: N | null,
  ): T {
    const callback = () => {
      return this.gCanvas!.insertBefore(child, refChild);
    };
    if (this.gCanvas) {
      return callback();
    } else {
      this._initialCallback.push(callback);
      return child;
    }
  }

  removeChild<T extends DisplayObject>(child: T): T {
    const callback = () => {
      return this.gCanvas!.removeChild(child);
    };
    if (this.gCanvas) {
      return callback();
    } else {
      this._initialCallback.push(callback);
      return child;
    }
  }

  removeChildren() {
    const callback = () => {
      return this.gCanvas!.removeChildren();
    };
    if (this.gCanvas) {
      return callback();
    } else {
      this._initialCallback.push(callback);
    }
  }

  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions | undefined,
  ) {
    const callback = () => {
      return this.gCanvas!.addEventListener(type, listener, options);
    };
    if (this.gCanvas) {
      return callback();
    } else {
      this._initialCallback.push(callback);
    }
  }

  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions | undefined,
  ) {
    const callback = () => {
      return this.gCanvas!.removeEventListener(type, listener, options);
    };
    if (this.gCanvas) {
      return callback();
    } else {
      this._initialCallback.push(callback);
    }
  }

  dispatchEvent<T extends FederatedEvent<Event, any>>(
    e: T,
    skipPropagate?: boolean | undefined,
  ) {
    const callback = () => {
      return this.gCanvas!.dispatchEvent(e, skipPropagate);
    };
    if (this.gCanvas) {
      return callback();
    } else {
      this._initialCallback.push(callback);
      return false;
    }
  }

  getRoot() {
    return this.gCanvas?.getRoot();
  }

  show() {
    this.visible = true;
    if (!this.mapSyncService?.isOutZoom && this.gCanvas) {
      this.gCanvas.getRoot().style.visibility = 'visible';
    }
    return super.show();
  }

  hide() {
    this.visible = false;
    if (this.gCanvas) {
      this.gCanvas.getRoot().style.visibility = 'hidden';
    }
    return super.hide();
  }

  fitBounds = (fitBoundsOptions?: unknown) => {
    if (this.gCanvas) {
      const { min, max } = this.gCanvas.getRoot().getRenderBounds();
      const { lng: minLng, lat: minLat } = this.mapService.containerToLngLat([
        min[0],
        min[1],
      ]);
      const { lng: maxLng, lat: maxLat } = this.mapService.containerToLngLat([
        max[0],
        max[1],
      ]);
      this.mapService.fitBounds(
        [
          [minLng, minLat],
          [maxLng, maxLat],
        ],
        fitBoundsOptions,
      );
    }

    return this;
  };

  boxSelect: BaseLayer['boxSelect'] = (box, cb) => {
    const [minLng, minLat, maxLng, maxLat] = box;
    const { x: x1, y: y1 } = this.mapService.lngLatToContainer([
      minLng,
      minLat,
    ]);
    const { x: x2, y: y2 } = this.mapService.lngLatToContainer([
      maxLng,
      maxLat,
    ]);
    const minX = Math.min(x1, x2);
    const minY = Math.min(y1, y2);
    const maxX = Math.max(x1, x2);
    const maxY = Math.max(y1, y2);
    return cb(
      this.gCanvas?.getRoot().childNodes.filter((child) => {
        const {
          min: [minNodeX, minNodeY],
          max: [maxNodeX, maxNodeY],
        } = (child as DisplayObject).getRenderBounds();
        return (
          minNodeX >= minX &&
          minNodeY >= minY &&
          maxNodeX <= maxX &&
          maxNodeY <= maxY
        );
      }) ?? [],
    );
  };

  protected _onIsOutZoomChange = (isOutZoom: boolean) => {
    const rootGroup = this.gCanvas?.getRoot();
    if (!rootGroup) {
      return;
    }
    if (isOutZoom && this.visible) {
      rootGroup.style.visibility = 'hidden';
    }
    if (!isOutZoom && this.visible) {
      rootGroup.style.visibility = 'visible';
    }
  };
}
