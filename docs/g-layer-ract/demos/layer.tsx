import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { GCircleReact, GLayerReact } from '@antv/l7-extension-g-layer-react';
import { LarkMap } from '@antv/larkmap';

import React from 'react';

const config = {
  style: 'light',
  center: [120.210792, 30.246026] as [number, number],
  pitch: 0,
  zoom: 8,
  rotation: 0,
};
const list: number[] = [];

for (let i = 0; i < 30; i++) {
  list.push(i);
}

export default function Demo1() {
  const renderer = new CanvasRenderer();

  return (
    <LarkMap mapType="Gaode" mapOptions={config} style={{ height: '300px' }}>
      <GLayerReact
        config={{
          renderer,
        }}
      >
        {list.map((item) => (
          <GCircleReact
            key={item}
            style={{
              cx: Math.random() * 0.02 + 120.104,
              cy: Math.random() * 0.02 + 30.26,
              r: 6,
              fill: '#1890FF',
              stroke: '#ffffff',
              lineWidth: 2,
            }}
          />
        ))}
      </GLayerReact>
    </LarkMap>
  );
}
