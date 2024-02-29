import { DisplayObject, Canvas as GCanvas, IRenderer } from '@antv/g';
import { CanvasLayer2 } from '@antv/l7';
import './index.css';
import { MapSyncService } from './services';
import { GLayerOptions } from './types';

export class GLayer extends CanvasLayer2 {
  gCanvas: GCanvas | null = null;
  gRenderer: IRenderer;
  mapSyncService: MapSyncService | null = null;
  // 用于存储添加节点的回调函数数组
  _appendNodeCallbacks: (() => void)[] = [];

  constructor(config: GLayerOptions) {
    super(config);
    this.gRenderer = config.renderer;
  }

  async buildModels() {
    super.buildModels();
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
    this.injectDevtool();
    this.mapSyncService = new MapSyncService(this.gCanvas, this.mapService);
    if (this._appendNodeCallbacks.length) {
      this._appendNodeCallbacks.forEach((cb) => cb());
      this._appendNodeCallbacks = [];
    }
  }

  setRenderer(renderer: IRenderer) {
    this.gRenderer = renderer;
    this.gCanvas?.setRenderer(renderer);
  }

  initContainer() {
    const container = document.createElement('div');
    container.classList.add('l7-g-container');
    container.style.zIndex = this.getLayerConfig().zIndex;
    this.mapService.getContainer()!.appendChild(container);
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
      this._appendNodeCallbacks.push(callback);
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
      this._appendNodeCallbacks.push(callback);
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
      this._appendNodeCallbacks.push(callback);
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
      this._appendNodeCallbacks.push(callback);
    }
  }

  getRoot() {
    return this.gCanvas?.getRoot();
  }
}
