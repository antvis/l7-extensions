import { CanvasEvent } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { GaodeMap, Scene } from '@antv/l7';
import { GCircle, GLayer } from '@antv/l7-g-plugin';
import React, { useEffect } from 'react';
import Stats from 'stats.js';

export default function Demo1() {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        style: 'normal',
        center: [120.104769, 30.261406],
        zoom: 15.85,
      }),
    });
    scene.on('loaded', () => {
      const gLayer = new GLayer({
        renderer: new CanvasRenderer(),
      });
      scene.addLayer(gLayer);

      gLayer.on('add', () => {
        for (let i = 0; i < 300; i++) {
          const circle = new GCircle({
            style: {
              cx: Math.random() * 0.02 + 120.104,
              cy: Math.random() * 0.02 + 30.26,
              r: 6,
              fill: '#1890FF',
              stroke: '#ffffff',
              lineWidth: 2,
            },
          });
          gLayer.gCanvas?.appendChild(circle);
        }

        gLayer.gCanvas?.addEventListener(CanvasEvent.READY, () => {
          console.log('ready');
          gLayer.gCanvas?.getRoot().childNodes.forEach((node) => {
            node.addEventListener('click', (e) => {
              console.log('click', e);
            });
          });
        });

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
    });
  }, []);

  return <div id="map" style={{ position: 'relative', height: 400 }}></div>;
}
