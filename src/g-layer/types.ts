import type { IRenderer } from '@antv/g';
import type { ICanvasLayer2Options } from '@antv/l7-layers';

export interface GLayerOptions extends ICanvasLayer2Options {
  renderer: IRenderer;
  visible?: boolean;
  minZoom?: number;
  maxZoom?: number;
}
