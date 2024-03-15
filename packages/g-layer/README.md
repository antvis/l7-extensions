# @antv/l7-extension-g-layer

![TypeScript](https://img.shields.io/badge/language-typescript-blue.svg) ![License](https://img.shields.io/badge/license-MIT-000000.svg) [![npm package](https://img.shields.io/npm/v/@antv/l7-extension-g-layer)](https://www.npmjs.com/package/@antv/l7-extension-g-layer)

> 支持在 L7 中接入 [G](https://github.com/antvis/g) 以接入更灵活的图形绘制和动画能力。

## 安装

```bash
npm install -S @antv/l7 @antv/g @antv/l7-extension-g-layer # and other G renderer...
```

## 使用

```ts
import { GaodeMap, Scene } from '@antv/l7';
import { GLayer, GCircle } from '@antv/l7-extension-g-layer';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';

const scene = new Scene({
  // ...
});

scene.on('loaded', () => {
  // 初始化 GLayer
  const gLayer = new GLayer({
    renderer: new CanvasRenderer(),
  });

  // 为 GLayer 中添加形状为圆的绘制元素
  const circle = new GCircle({
    // 设置圆的经纬度位置以及其他样式
    style: {
      cx: 120.104,
      cy: 30.26,
      r: 6,
      fill: '#1890FF',
      stroke: '#ffffff',
      lineWidth: 2,
    },
  });
  // 将绘制元素添加到 GLayer
  gLayer.appendChild(circle);

  // 将 GLayer 添加到 L7 的 Scene 场景中
  scene.addLayer(gLayer);
});
```
