import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { GLayerReact } from '@antv/l7-extension-g-layer-react';
import { LarkMap } from '@antv/larkmap';

import React from 'react';

const mapId = 'map' + Math.random();

export default function Demo1() {
  const config = {
    style: 'light',
    center: [120.210792, 30.246026] as [number, number],
    pitch: 0,
    zoom: 8,
    rotation: 0,
  };

  return (
    <LarkMap mapType="Gaode" mapOptions={config} style={{ height: '300px' }}>
      <GLayerReact
        config={{
          renderer: new CanvasRenderer(),
        }}
      ></GLayerReact>
    </LarkMap>
  );
}
