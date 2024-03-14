import type { IRenderer } from '@antv/g';
import type { ICanvasLayerOptions } from '@antv/l7-layers';

export interface GLayerOptions extends ICanvasLayerOptions {
  renderer: IRenderer;
  visible?: boolean;
  minZoom?: number;
  maxZoom?: number;
}
