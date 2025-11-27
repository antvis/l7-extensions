import { CanvasEvent } from '@antv/g';
import { GLayer } from '@antv/l7-extension-g-layer';
import { useScene } from '@antv/larkmap';
import React, { useEffect } from 'react';
import Stats from 'stats.js';
import { useLayerEvent } from '../hooks';

export const GLayerContext = React.createContext<GLayer | null>(null);

export function GLayerReact(props) {
  const { config, children } = props;
  const gLayer = new GLayer({ ...config });
  const scene = useScene();
  scene.addLayer(gLayer);

  const stats = new Stats();
  stats.showPanel(0);
  const $stats = stats.dom;
  $stats.style.position = 'absolute';
  $stats.style.left = '0px';
  $stats.style.top = '0px';
  const $wrapper = scene.getMapContainer() as HTMLElement;
  $wrapper.appendChild($stats);
  gLayer.gCanvas?.addEventListener(CanvasEvent.AFTER_RENDER, () => {
    if (stats) {
      stats.update();
    }
  });
  useEffect(() => {
    return () => {
      scene.removeLayer(gLayer);
    };
  }, []);

  useLayerEvent(gLayer, props);

  return (
    <GLayerContext.Provider value={gLayer}>{children}</GLayerContext.Provider>
  );
}
