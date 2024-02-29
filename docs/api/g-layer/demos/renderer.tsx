import { CanvasEvent } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Renderer as SVGRender } from '@antv/g-svg';
import { Renderer as WebglRenderer } from '@antv/g-webgl';
import { GaodeMap, Scene } from '@antv/l7';
import { GCircle, GLayer } from '@antv/l7-g-plugin';
import GUI from 'lil-gui';
import React, { useEffect } from 'react';
import Stats from 'stats.js';

const mapId = 'map' + Math.random();

const canvasRenderer = new CanvasRenderer();
const svgRenderer = new SVGRender();
const webglRenderer = new WebglRenderer();

export default function Demo1() {
  useEffect(() => {
    const scene = new Scene({
      id: mapId,
      map: new GaodeMap({
        style: 'normal',
        center: [120.104769, 30.261406],
        zoom: 15.85,
      }),
    });
    scene.on('loaded', () => {
      const gLayer = new GLayer({
        renderer: canvasRenderer,
      });
      scene.addLayer(gLayer);

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
        gLayer.appendChild(circle);
      }

      const gui = new GUI({
        autoPlace: false,
      });
      gui
        .add(
          {
            renderer: 'canvas',
          },
          'renderer',
          ['canvas', 'svg', 'webgl'],
        )
        .onChange((value: string) => {
          if (value === 'canvas') {
            gLayer.setRenderer(canvasRenderer);
          }
          if (value === 'svg') {
            gLayer.setRenderer(svgRenderer);
          }
          if (value === 'webgl') {
            gLayer.setRenderer(webglRenderer);
          }
        });

      scene.getMapContainer()?.append(gui.domElement);

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
