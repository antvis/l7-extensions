/* eslint-disable @typescript-eslint/no-unused-vars */
import type {
  FeatureCollection,
  Geometry,
  GeometryCollection,
} from '@turf/helpers';
import type {
  ChildrenDataOptions,
  IDataOptions,
  ISourceOptions,
} from './baseSource';
import BaseSource from './baseSource';

const DataConfig = {
  desc: {
    text: 'DataV',
    href: 'https://datav.aliyun.com/portal/school/atlas/area_selector',
  },
  url: 'https://geo.datav.aliyun.com',
};

export class DataVSource extends BaseSource {
  public info = DataConfig;
  protected getDefaultOptions(): Partial<ISourceOptions> {
    return {
      version: 'areas_v3',
    };
  }
  public getRenderData(
    options: Partial<IDataOptions>,
  ): Promise<
    FeatureCollection<Geometry | GeometryCollection, Record<string, any>>
  > {
    throw new Error('Method not implemented.');
  }

  public getData(
    options: Partial<IDataOptions>,
  ): Promise<
    FeatureCollection<Geometry | GeometryCollection, Record<string, any>>
  > {
    const { code, full } = options as any;
    const data = this.fetchData(code, full);
    return data;
  }

  public getChildrenData(
    ChildrenDataOptions: Partial<ChildrenDataOptions>,
  ): Promise<
    FeatureCollection<Geometry | GeometryCollection, Record<string, any>>
  > {
    const { parentName, full } = ChildrenDataOptions as any;
    const data = this.fetchData(parentName, full);
    return data;
  }

  public async fetchData(
    code: number,
    full?: boolean,
  ): Promise<
    FeatureCollection<Geometry | GeometryCollection, Record<string, any>>
  > {
    let url = full
      ? `${DataConfig.url}/${this.version}/bound/${code}_full.json`
      : `${DataConfig.url}/${this.version}/bound/${code}.json`;
    if (this.options.getCdnUrl) {
      url = this.options.getCdnUrl({
        origin: DataConfig.url,
        version: this.version,
        adcode: code,
        isFull: full,
      });
    }
    return await this.fetchJsonData(url);
  }
}
