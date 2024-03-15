import { CanvasEvent } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Renderer as SVGRender } from '@antv/g-svg';
import { Renderer as WebglRenderer } from '@antv/g-webgl';
import { GaodeMap, IPoint, Scene } from '@antv/l7';
import { GCircle, GLayer } from '@antv/l7-extension-g-layer';
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

      function initCircle({ x: cx, y: cy }: IPoint) {
        const circle = new GCircle({
          style: {
            cx,
            cy,
            r: 6,
            fill: '#1890FF',
            stroke: '#ffffff',
            lineWidth: 2,
          },
        });
        gLayer.appendChild(circle);
        circle.addEventListener(
          'click',
          (e: any) => {
            gLayer.removeChild(e.target);
          },
          {
            once: true,
          },
        );
      }

      for (let i = 0; i < 300; i++) {
        initCircle({
          x: Math.random() * 0.02 + 120.104,
          y: Math.random() * 0.02 + 30.26,
        });
      }

      gLayer.addEventListener('click', (e: any) => {
        console.log(e);
        if (e.target.nodeName === 'document') {
          const {
            coordinates: [lng, lat],
          } = e;
          initCircle({ x: lng, y: lat });
        }
      });

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
