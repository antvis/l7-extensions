import { CanvasEvent } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { GaodeMap, Scene } from '@antv/l7';
import { GLayer, GPolygon } from '@antv/l7-extension-g-layer';
import React, { useEffect } from 'react';
import Stats from 'stats.js';

const mapId = 'map' + Math.random();

export default function Demo1() {
  useEffect(() => {
    const scene = new Scene({
      id: mapId,
      map: new GaodeMap({
        style: 'normal',
        center: [120.5, 30.5],
        zoom: 8,
      }),
    });
    scene.on('loaded', () => {
      const gLayer = new GLayer({
        renderer: new CanvasRenderer(),
      });
      scene.addLayer(gLayer);

      const points: [number, number][] = [];
      for (let i = 0; i < 3; i++) {
        points.push([Math.random() + 120, Math.random() + 30]);
      }
      const polygon = new GPolygon({
        style: {
          points,
          fill: '#1677ff9e',
          stroke: '#1890FF',
          lineWidth: 2,
          cursor: 'pointer',
        },
      });
      gLayer.appendChild(polygon);

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
    });
  }, []);

  return <div id={mapId} style={{ position: 'relative', height: 400 }}></div>;
}
