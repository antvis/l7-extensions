import { CanvasEvent } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { GaodeMap, Scene } from '@antv/l7';
import { GCircle, GLayer } from '@antv/l7-extension-g-layer';
import React, { useEffect, useState } from 'react';
import Stats from 'stats.js';

const mapId = 'map' + Math.random();

export default function Demo1() {
  const [layer, setLayer] = useState<GLayer>();
  const [scene, setScene] = useState<Scene>();

  useEffect(() => {
    const newScene = new Scene({
      id: mapId,
      map: new GaodeMap({
        style: 'normal',
        center: [120.104769, 30.261406],
        zoom: 15.85,
      }),
    });
    newScene.on('loaded', () => {
      setScene(newScene);
      const gLayer = new GLayer({
        renderer: new CanvasRenderer(),
        minZoom: 10,
        maxZoom: 16,
      });
      newScene.addLayer(gLayer);

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

      gLayer.on('add', () => setLayer(gLayer));
      newScene.on('selectend', (box) => {
        gLayer.boxSelect(box, (circles) => {
          alert(`选中了${circles.length}个圆形`);
        });
      });

      const stats = new Stats();
      stats.showPanel(0);
      const $stats = stats.dom;
      $stats.style.position = 'absolute';
      $stats.style.left = '0px';
      $stats.style.top = '0px';
      const $wrapper = newScene.getMapContainer() as HTMLElement;
      $wrapper.appendChild($stats);
      gLayer.gCanvas?.addEventListener(CanvasEvent.AFTER_RENDER, () => {
        if (stats) {
          stats.update();
        }
      });
    });
  }, []);

  return (
    <>
      <button type="button" onClick={() => layer?.show()}>
        显示
      </button>
      <button type="button" onClick={() => layer?.hide()}>
        隐藏
      </button>
      <button type="button" onClick={() => layer?.fitBounds()}>
        缩放至数据
      </button>
      <button type="button" onClick={() => scene?.enableBoxSelect()}>
        框选
      </button>
      <div id={mapId} style={{ position: 'relative', height: 400 }}></div>
    </>
  );
}
