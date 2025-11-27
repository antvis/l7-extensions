import { GCircle } from '@antv/l7-extension-g-layer';
import { memo } from 'react';
import { useLayerEvent } from '../../../hooks';
import { useGLayer } from '../../gLayerContext';

export const GCircleReact = memo(function GCircleReact(props) {
  const contextValue = useGLayer();
  const layer = new GCircle(props);

  //@ts-ignore
  useLayerEvent(layer, props);

  contextValue.appendChild(layer);

  return null;
});
