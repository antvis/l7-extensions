# @antv/l7-extension-g-layer

![TypeScript](https://img.shields.io/badge/language-typescript-blue.svg) ![License](https://img.shields.io/badge/license-MIT-000000.svg) [![npm package](https://img.shields.io/npm/v/@antv/l7-extension-g-layer)](https://www.npmjs.com/package/@antv/l7-extension-g-layer)

> 支持在 L7 中接入 [G](https://github.com/antvis/g) 以接入更灵活的图形绘制和动画能力。

## 安装

```bash
npm install -S @antv/l7 @antv/g @antv/l7-extension-g-layer # and other G Renderer...
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

  // 为 GLayer 中添加形状为圆的基础图形
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
  // 将基础图形添加到 GLayer
  gLayer.appendChild(circle);

  // 将 GLayer 添加到 L7 的 Scene 场景中
  scene.addLayer(gLayer);
});
```

## API

### GLayer

> `GLayer` 继承自 `L7` 的 `BaseLayer`，负责统一管理所有的基础图形，同时在地图发生变更时会同步更新各个基础图形的位置。

#### 配置

在 `GLayer` 实例化时传入的参数，除了 [L7 BaseLayer](https://github.com/antvis/L7/blob/ec93559e0a208155635bb9e7b16682ed72d8a538/packages/layers/src/core/BaseLayer.ts#L69) 的基础配置。

| 名称     | 作用                                                                                                                                              | 类型                                                                                                                               |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| renderer | **必传**，配置`GLayer` 的 [G 渲染器](https://g.antv.antgroup.com/api/renderer/intro)，常用的有 `@antv/g-canvas`、`@antv/g-svg` 和 `@antv/g-webgl` | [IRenderer](https://github.com/antvis/G/blob/654021b78bf63af03000db158c482eedeab14d51/packages/g-lite/src/AbstractRenderer.ts#L38) |
| visible  | 初始化后是否可见，实例化后可通过`show`/`hide` 方法控制图层的显示和隐藏                                                                            | `boolean`                                                                                                                          |
| minZoom  | 图层显示的最小`zoom` 级别                                                                                                                         | `undefined`                                                                                                                        |
| maxZoom  | 图层显示的最大`zoom` 级别                                                                                                                         | `undefined`                                                                                                                        |

#### 属性

| 名称    | 作用                 | 类型                                                                                                                  |
| ------- | -------------------- | --------------------------------------------------------------------------------------------------------------------- |
| gCanvas | `G` 的 `Canvas` 实例 | [Canvas](https://github.com/antvis/G/blob/e36259e4bbe10376bab79ed7c87148dc12abe81a/packages/g-lite/src/Canvas.ts#L75) |

#### 方法

| 名称                | 作用                                                                        | 类型                                                                                                                                          |
| ------------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| appendChild         | 向画布中添加基础图形，可通过第二个参数 `index` 指定插入的下标               | `(child: IL7GDisplayObject, index?: number) => IL7GDisplayObject`                                                                             |
| insertBefore        | 向画布中的目标基础图形之前插入新的基础图形                                  | `(child: IL7GDisplayObject, refChild: IL7GDisplayObject) => IL7GDisplayObject`                                                                |
| removeChild         | 删除目标元素                                                                | `(child: IL7GDisplayObject) => IL7GDisplayObject`                                                                                             |
| removeChildren      | 清除所有基础图形                                                            | `() => void`                                                                                                                                  |
| addEventListener    | 监听事件，详情可见 [画布事件](https://g.antv.antgroup.com/api/canvas/event) | `(eventName: string, listener: ((e: FederatedEvent) => void), options: boolean &#124; AddEventListenerOptions &#124; undefined) => void void` |
| removeEventListener | 移除事件监听                                                                | `(eventName: string, listener: ((e: FederatedEvent) => void), options: boolean &#124; AddEventListenerOptions &#124; undefined) => void void` |
| dispatchEvent       | 触发事件                                                                    | `(e: FederatedEvent, skipPropagate?: boolean &#124; undefined) => void`                                                                       |
| getRoot             | 获取基础图形的根 `Group`                                                    | `() => Group`                                                                                                                                 |
| show                | 显示图层                                                                    | `() => void`                                                                                                                                  |
| hide                | 隐藏图层                                                                    | `() => void`                                                                                                                                  |
| fitBounds           | 将地图自动缩放和平移至所有元素可见                                          | `() => void`                                                                                                                                  |
| boxSelect           | 通过经纬度区间获取选中的基础图形                                            | `(box: [number, number, number, number], callback: (features: IL7GDisplayObject[])) => void`                                                  |

#### 事件

`GLayer` 会代理 `G` 中 `Canvas` 上的事件，并可以通过 `addEventListener`、`removeEventListener` 方法用于管理事件回调，更多 `Canvas` 事件可见：[画布事件](https://g.antv.antgroup.com/api/canvas/event)。

另外在鼠标相关的交互事件中，GLayer 会自动在传入回调函数中的 `event` 事件对象中添加 `coordinates` 字段表示鼠标所在的经纬度。

```ts
{
  // ... 其他事件对象属性
  coordinates: [number, number];
}
```

### 基础元素

`@antv/l7-extension-g-layer` 对 `G` 中的基础图形进行了封装，支持使用经纬度来描述元素的位置信息。并且在地图状态发生变更时，会根据基础图形的经纬度位置实时更新其相对位置。和 `GLayer` 的事件类似，基础元素在鼠标相关的事件回调中会注入 `coordinates` 字段表示鼠标所在的经纬度。

当前 `@antv/l7-extension-g-layer` 内置了以下基础图形：

#### GGroup 图形分组

继承自 `G` 的 `Group`，本身并无实体，只容纳其他子元素，因此无位置属性，更多配置可见 [Group](https://g.antv.antgroup.com/api/basic/group)。

```ts
import { GCircle, GGroup } from '@antv/l7-extension-g-layer';

const group = new Group();
const circle = new GCircle();
group.appendChild(circle);
```

#### GCircle 圆

继承自 `G` 的 `Circle`，用于在目标经纬度为圆心，固定像素半径绘制圆，更多配置可见 [Circle](https://g.antv.antgroup.com/api/basic/circle)。

```ts
import { GCircle } from '@antv/l7-extension-g-layer';

const circle = new GCircle({
  style: {
    // cx 和 cy 分别设置经度和纬度
    cx: 120,
    cy: 30,
    // 圆半径固定为 100px
    r: 100,
  },
});
```

#### GEllipse 椭圆

继承自 `G` 的 `Ellipse`，用于在目标经纬度为圆心，固定横纵轴像素半径绘制椭圆，更多配置可见 [Ellipse](https://g.antv.antgroup.com/api/basic/ellipse)。

```ts
import { GEllipse } from '@antv/l7-extension-g-layer';

const ellipse = new GEllipse({
  style: {
    // cx 和 cy 分别设置经度和纬度
    cx: 120,
    cy: 30,
    // 圆横纵轴半径固定为 100px
    rx: 100,
    ry: 100,
  },
});
```

#### GRect 矩形

继承自 `G` 的 `Rect`，用于在目标经纬度为左上角顶点，固定长宽像素半径绘制矩形，更多配置可见 [Rect](https://g.antv.antgroup.com/api/basic/rect)。

```ts
import { GRect } from '@antv/l7-extension-g-layer';

const rect = new GRect({
  style: {
    // x 和 y 分别设置经度和纬度
    x: 120,
    y: 30,
    // 矩形的长/宽均为 100px
    width: 100,
    height: 100,
  },
});
```

#### GImage 图片

继承自 `G` 的 `Image`，用于在目标经纬度为左上角顶点，固定长宽像素半径绘制图片，更多配置可见 [Image](https://g.antv.antgroup.com/api/basic/image)。

```ts
import { GImage } from '@antv/l7-extension-g-layer';

const image = new GImage({
  style: {
    // x 和 y 分别设置经度和纬度
    x: 120,
    y: 30,
    // 矩形的长/宽均为 100px
    width: 100,
    height: 100,
    img: 'https://gw.alipayobjects.com/mdn/rms_6ae20b/afts/img/A*N4ZMS7gHsUIAAAAAAAAAAABkARQnAQ',
  },
});
```

#### GText 文本

继承自 `G` 的 `Text`，用于在目标经纬度为文本锚点绘制文本字符串，更多配置可见 [Text](https://g.antv.antgroup.com/api/basic/text)。

```ts
import { GText } from '@antv/l7-extension-g-layer';

const text = new GText({
  style: {
    // x 和 y 分别设置经度和纬度
    x: 120,
    y: 30,
    // 矩形的长/宽均为 100px
    text: 'Hello World!',
  },
});
```

#### GLine 直线

继承自 `G` 的 `Line`，用于在两个目标经纬度为端点绘制线段，更多配置可见 [Line](https://g.antv.antgroup.com/api/basic/line)。

```ts
import { GLine } from '@antv/l7-extension-g-layer';

const line = new GLine({
  style: {
    // x1、x2 和 y1、y2 分别设置经度和纬度
    x1: 120,
    y1: 30,
    x2: 130,
    y2: 40,
  },
});
```

#### GPolyline 折线

继承自 `G` 的 `Polyline`，用于在多个经纬度为节点绘制折线，更多配置可见 [Polyline](https://g.antv.antgroup.com/api/basic/polyline)。

```ts
import { GPolyline } from '@antv/l7-extension-g-layer';

const polyline = new GPolyline({
  style: {
    points: [
      // 节点位置数组第一项为经度，第二项为纬度
      [120, 30],
      [130, 40],
      [140, 50],
    ],
  },
});
```

#### GPolygon

继承自 `G` 的 `Polygon`，用于在多个经纬度为节点绘制多边形，更多配置可见 [Polygon](https://g.antv.antgroup.com/api/basic/polygon)。

```ts
import { GPolygon } from '@antv/l7-extension-g-layer';

const polygon = new GPolygon({
  style: {
    points: [
      // 节点位置数组第一项为经度，第二项为纬度
      [120, 30],
      [130, 40],
      [140, 30],
    ],
  },
});
```

#### GPath

继承自 `G` 的 `Path`，用于在多个经纬度定义直线、折线、圆弧、贝塞尔曲线等，更多配置可见 [Path](https://g.antv.antgroup.com/api/basic/path)。

```ts
import { GPath } from '@antv/l7-extension-g-layer';

const path = new GPath({
  style: {
    points: [
      // 节点位置数组第一项为经度，第二项为纬度
      ['M', 120, 30],
      ['L', 130, 40],
    ],
  },
});
```

#### GHTML

继承自 `G` 的 `HTML`，用于在目标经纬度绘制 HTML 元素，更多配置可见 [HTML](https://g.antv.antgroup.com/api/basic/html)。

```ts
import { GHTML } from '@antv/l7-extension-g-layer';

const html = new GHTML({
  style: {
    // x 和 y 分别设置经度和纬度
    x: 120,
    y: 30,
    width: 100,
    height: 100,
    innerHTML: '<h1>This is Title</h1>',
  },
});
```

## FAQ

- `GLayer` 的底层原理？

`GLayer` 通过在 `L7` 中地图底图画布和官方图层画布之上叠加了一层由 `G` 控制的 `canvas` 画布并进行绘制的。

当用户将内置的基础图形（通过经纬度描述位置）添加至 `GLayer` 时，`GLayer` 会计算将 **经纬度坐标** 转换为 **像素坐标** 后添加至画布中，并且在地图发生变化时同步更新对应的像素坐标。

## LICENSE

[MIT](https://github.com/antvis/L7Extension/blob/master/LICENSE)
