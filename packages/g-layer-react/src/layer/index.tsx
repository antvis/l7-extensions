import { CanvasLayer, ICanvasLayerOptions } from '@antv/l7';
import { GLayer } from '@antv/l7-extension-g-layer';
import { forwardRef, memo, useImperativeHandle } from 'react';
import { useCreateLayer, useLayerEvent } from '../hooks';

export const GLayerReact = memo(
  forwardRef<CanvasLayer, ICanvasLayerOptions>(function GLayerReact(
    props,
    ref,
  ) {
    const layerRef = useCreateLayer<CanvasLayer, ICanvasLayerOptions>(
      GLayer,
      props,
    );

    useLayerEvent(layerRef.current, props);
    useImperativeHandle(ref, () => layerRef.current);

    return null;
  }),
);
