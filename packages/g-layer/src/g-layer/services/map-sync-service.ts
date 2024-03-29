import { Canvas, DisplayObject, ElementEvent, MutationEvent } from '@antv/g';
import { IMapService } from '@antv/l7-core';
import { isNumber } from '@antv/util';
import EventEmitter from 'eventemitter3';
import { IL7GDisplayObject } from '../../display-object';
import type { GLayer } from '../index';
import { formatRotation } from '../utils';

type MapStatus = {
  center: {
    x: number;
    y: number;
    lng: number;
    lat: number;
  };
  pitch: number;
  rotation: number;
};

export enum MapSyncServiceEvent {
  IS_OUT_ZOOM_CHANGE = 'is-out-zoom-change',
}

export class MapSyncService extends EventEmitter {
  gCanvas: Canvas;
  mapService: IMapService;
  gLayer: GLayer;
  isZooming = false;
  isMoving = false;
  isOutZoom = false;
  mapStatus: MapStatus = {
    center: {
      x: 0,
      y: 0,
      lng: 0,
      lat: 0,
    },
    pitch: 0,
    rotation: 0,
  };

  get layerConfig() {
    return this.gLayer.getLayerConfig();
  }

  get rootGroup() {
    return this.gCanvas.getRoot();
  }

  constructor(gCanvas: Canvas, mapService: IMapService, gLayer: GLayer) {
    super();
    this.gCanvas = gCanvas;
    this.mapService = mapService;
    this.gLayer = gLayer;

    if (this.layerConfig.visible === false) {
      this.rootGroup.style.visibility = false;
    }
    this.syncPrevMapStatus();
    this.bindMapEvents();
    requestAnimationFrame(() => {
      this.syncIsOutZoom();
    });
  }

  onNodeInsert = (e: MutationEvent) => {
    if (e.target instanceof DisplayObject) {
      const target = e.target as IL7GDisplayObject;
      target?.syncPosition?.(this.mapService);
      target.on('COORDINATES_MODIFIED', this.onNodeCoordinatesModified);
    }
  };

  onNodeCoordinatesModified = (e: MutationEvent) => {
    if (e.target instanceof DisplayObject) {
      (e.target as IL7GDisplayObject)?.syncPosition?.(this.mapService);
    }
  };

  onNodeRemove = (e: MutationEvent) => {
    if (e.target instanceof DisplayObject) {
      (e.target as IL7GDisplayObject).off(
        'COORDINATES_MODIFIED',
        this.onNodeCoordinatesModified,
      );
    }
  };

  onMapZoomStart = () => {
    this.isZooming = true;
  };

  onMapZooming = () => {
    this.syncNodesPosition();
    this.syncIsOutZoom();
  };

  onMapZoomEnd = () => {
    this.isZooming = false;
  };

  onMapMoveStart = () => {
    this.isMoving = true;
  };

  onMapChange = () => {
    const pitch = this.mapService.getPitch();
    const rotation = formatRotation(this.mapService.getRotation());
    if (rotation || pitch) {
      this.syncNodesPosition();
    } else if (this.isMoving && !this.isZooming) {
      const { x: oldX, y: oldY, lng, lat } = this.mapStatus.center;
      const { x, y } = this.mapService.lngLatToContainer([lng, lat]);
      const dx = x - oldX;
      const dy = y - oldY;
      this.rootGroup.style.transform = `translate(${dx}px, ${dy}px)`;
      this.gCanvas.render();
    }
  };

  onMapMoveEnd = () => {
    this.isMoving = false;
    this.syncNodesPosition();
  };

  syncNodesPosition() {
    const rootGroup = this.rootGroup;
    const childNodes = rootGroup.childNodes;
    childNodes.forEach((node) => {
      if (node instanceof DisplayObject) {
        (node as IL7GDisplayObject)?.syncPosition?.(this.mapService);
      }
    });
    this.syncPrevMapStatus();
    rootGroup.style.transform = ``;
    this.gCanvas.render();
  }

  syncPrevMapStatus() {
    const { lng, lat } = this.mapService.getCenter();
    this.mapStatus = {
      center: {
        lng,
        lat,
        ...this.mapService.lngLatToContainer([lng, lat]),
      },
      pitch: this.mapService.getPitch(),
      rotation: formatRotation(this.mapService.getRotation()),
    };
  }

  syncIsOutZoom() {
    const { minZoom, maxZoom } = this.layerConfig;
    const zoom = this.mapService.getZoom();
    let newIsOutZoom = this.isOutZoom;
    if (
      (isNumber(minZoom) && zoom < minZoom) ||
      (isNumber(maxZoom) && zoom > maxZoom)
    ) {
      newIsOutZoom = true;
    } else {
      newIsOutZoom = false;
    }
    if (newIsOutZoom !== this.isOutZoom) {
      this.isOutZoom = newIsOutZoom;
      this.emit(MapSyncServiceEvent.IS_OUT_ZOOM_CHANGE, newIsOutZoom);
    }
  }

  bindMapEvents() {
    this.gCanvas.addEventListener(ElementEvent.INSERTED, this.onNodeInsert);
    this.gCanvas.addEventListener(ElementEvent.REMOVED, this.onNodeRemove);
    this.mapService.on('zoomstart', this.onMapZoomStart);
    this.mapService.on('zoomchange', this.onMapZooming);
    this.mapService.on('zoomend', this.onMapZoomEnd);
    this.mapService.on('movestart', this.onMapMoveStart);
    this.mapService.on('mapchange', this.onMapChange);
    this.mapService.on('moveend', this.onMapMoveEnd);
  }

  unbindMapEvents() {
    this.gCanvas.removeEventListener(ElementEvent.INSERTED, this.onNodeInsert);
    this.gCanvas.removeEventListener(ElementEvent.REMOVED, this.onNodeRemove);
    this.mapService.off('zoomstart', this.onMapZoomStart);
    this.mapService.off('zoomchange', this.onMapZooming);
    this.mapService.off('zoomend', this.onMapZoomEnd);
    this.mapService.off('movestart', this.onMapMoveStart);
    this.mapService.off('mapchange', this.onMapChange);
    this.mapService.off('moveend', this.onMapMoveEnd);
  }

  destroy() {
    this.unbindMapEvents();
  }
}
