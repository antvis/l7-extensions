import { useContext } from 'react';
import { GLayer } from '../types';
import { GLayerContext } from './index';

export const useGLayer = () => {
  const context = useContext<GLayer | null>(GLayerContext);
  if (!context) {
    throw new Error('The useLayerManager must be used in the GLayer container');
  }

  return context;
};
