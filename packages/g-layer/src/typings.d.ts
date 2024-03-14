import type { Canvas } from '@antv/g';

declare global {
  interface Window {
    __g_instances__?: Canvas[];
  }
}
