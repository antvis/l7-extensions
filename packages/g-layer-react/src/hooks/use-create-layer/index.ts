import { CanvasLayer, ICanvasLayerOptions } from '@antv/l7';
import { useLayerManager } from '@antv/larkmap';
import { useUpdateEffect } from 'ahooks';
import { cloneDeep, isEqual } from 'lodash-es';
import { useEffect, useRef } from 'react';

/**
 * LayerCtor 图层类 构造函数
 */
type LayerCtor<O, L> = new (options: O) => L;

/**
 * LayerOptions 图层基础配置
 */
type LayerBaseOptions = {
  /** 数据源 */
  source: { data: any };
};

export const useCreateLayer = <
  L extends CanvasLayer,
  C extends ICanvasLayerOptions & LayerBaseOptions,
>(
  Ctor: LayerCtor<C, L>,
  config: C,
) => {
  const { source, ...options } = config;
  const layerManager = useLayerManager();
  const layerRef = useRef<L>();
  const layerOptionsRef = useRef<Omit<C, 'source'>>(options);
  const layerSourceRef = useRef(source);

  // 创建图层
  // 添加到 layerManager 自动加载到 scene
  if (!layerRef.current) {
    layerRef.current = new Ctor(config);

    // @ts-ignore
    layerManager.addLayer(layerRef.current);
  }

  // options 更新时
  useUpdateEffect(() => {
    if (layerRef.current) {
      const changeOption = !isEqual(layerOptionsRef.current, options);
      if (changeOption) {
        // @ts-ignore
        layerRef.current.update(options);
        layerOptionsRef.current = cloneDeep(options);
      }
    }
  }, [options]);

  // source 更新时
  useUpdateEffect(() => {
    if (layerRef.current) {
      const { data, ...restOptions } = source;
      const { data: currentData, ...restCurrentOptions } =
        layerSourceRef.current;
      const changeSource =
        data !== currentData || !isEqual(restOptions, restCurrentOptions);
      if (changeSource) {
        // @ts-ignore
        layerRef.current.changeData(source);
        layerSourceRef.current = { ...source };
      }
    }
  }, [source]);

  // 组件销毁时
  useEffect(() => {
    return () => {
      if (layerRef.current) {
        // @ts-ignore
        layerManager.removeLayer(layerRef.current);
        // @ts-ignore
        layerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return layerRef;
};
