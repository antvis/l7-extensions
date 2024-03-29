/**
 * compact: true
 * inline: true
 */
import {
  CopyOutlined,
  DownloadOutlined,
  InfoCircleOutlined,
  PictureOutlined,
} from '@ant-design/icons';
import type { LayerPopupProps } from '@antv/larkmap';
import {
  ChoroplethLayer,
  LarkMap,
  LayerPopup,
  MapThemeControl,
} from '@antv/larkmap';
import { FeatureCollection } from '@turf/helpers';
import {
  Button,
  Col,
  Descriptions,
  Divider,
  Radio,
  Row,
  Select,
  Spin,
  Switch,
  Tooltip,
  message,
} from 'antd';
import type { BaseSource, DataLevel } from 'district-data';
import { DataSourceMap } from 'district-data';
import React, { useEffect, useMemo, useState } from 'react';
import { downloadData, exportSVG } from '../../utils/util';
import './index.less';
import {
  IDataInfo,
  config,
  defaultDataInfo,
  downloadDataType,
  editionOptions,
  getChildrenLevel,
  getChildrenList,
  item,
  layerOptions,
} from './util';

export default () => {
  const [layerSource, setLayerSource] = useState({
    data: { type: 'FeatureCollection', features: [] },
    parser: { type: 'geojson' },
  });
  const size = 'middle';
  const [dataInfo, setDataInfo] = useState<IDataInfo>(defaultDataInfo);
  const [drillList, setDrillList] = useState<any[]>([
    {
      currentLevel: 'country',
      currentName: '中国',
      currentCode: 100000,
    },
  ]);
  const childrenLevelList = useMemo(() => {
    return getChildrenList(dataInfo.currentLevel);
  }, [dataInfo.currentLevel]);
  const onDataConfigChange = (type: string, value: any) => {
    setDataInfo({
      ...dataInfo,
      [type]: value,
    });
  };
  const [dataSource, setDataSource] = useState<BaseSource>();

  const getDownloadData = async () => {
    const { currentLevel, hasSubChildren, childrenLevel, currentCode } =
      dataInfo;
    let data;
    if (!hasSubChildren) {
      data = (await dataSource?.getChildrenData({
        parentLevel: currentLevel,
        parentAdcode: currentCode,
        childrenLevel: currentLevel,
      })) as FeatureCollection;
      // 没有子级,取父级数据
    } else {
      data = (await dataSource?.getChildrenData({
        parentLevel: currentLevel,
        parentAdcode: currentCode,
        childrenLevel: childrenLevel,
      })) as FeatureCollection;
    }
    return data;
  };

  const onDownload = async () => {
    const { datatype, currentName } = dataInfo;
    const data = await getDownloadData();
    downloadData(currentName, data, datatype);
  };
  const onDownloadSvg = async () => {
    const { currentName } = dataInfo;
    const data = (await getDownloadData()) as FeatureCollection;
    return downloadData(currentName, data, 'SVG');
  };
  const onDownloadGUOJIE = async () => {
    const { datatype } = dataInfo;
    const data = await (
      await fetch(
        'https://mdn.alipayobjects.com/afts/file/A*zMVuS7mKBI4AAAAAAAAAAAAADrd2AQ/%E5%85%A8%E5%9B%BD%E8%BE%B9%E7%95%8C.json',
      )
    ).json();
    downloadData('中国边界', data, datatype);
  };

  const onCopyData = async () => {
    const data = (await getDownloadData()) as FeatureCollection;
    navigator.clipboard.writeText(JSON.stringify(data));
    message.success('复制成功');
  };
  const onCopySvg = async () => {
    const data = (await getDownloadData()) as FeatureCollection;
    const svgstring = await exportSVG(data);
    navigator.clipboard.writeText(svgstring);
    message.success('复制成功');
  };

  // 切换数据源
  useEffect(() => {
    const { sourceType, sourceVersion } = dataInfo;
    const currentSource = new DataSourceMap[sourceType]({
      version: sourceVersion,
    });
    setDataSource(currentSource);
    // 初始化数据
    currentSource.getData({ level: 'province', code: 100000 }).then((data) => {
      setLayerSource((prevState: any) => ({
        ...prevState,
        data,
      }));
    });
  }, [dataInfo.sourceType, dataInfo.sourceVersion]);

  // 下钻
  const onDblClick = async (e: any) => {
    const currentLevel = getChildrenLevel(dataInfo.currentLevel) as DataLevel;
    if (currentLevel === 'county') {
      return;
    }
    const currentInfo = {
      currentLevel: currentLevel,
      currentName: e.feature.properties.name,
      currentCode: e.feature.properties.adcode,
    };
    setDrillList([...drillList, currentInfo]);
    setDataInfo({
      ...dataInfo,
      ...currentInfo,
    });
    const data = await dataSource?.getChildrenData({
      parentLevel: currentInfo.currentLevel,
      parentAdcode: currentInfo.currentCode,
      childrenLevel: getChildrenLevel(currentLevel),
    });
    setLayerSource((prevState: any) => ({
      ...prevState,
      data,
    }));
  };

  const onUndblclick = async () => {
    const currentList = drillList.slice(0, drillList.length - 1);
    const currentInfo = currentList[currentList.length - 1];
    const currentLevel = dataInfo.currentLevel;
    if (currentLevel === 'country') {
      return;
    }

    setDataInfo({
      ...dataInfo,
      ...currentInfo,
    });
    setDrillList(currentList);

    const data = await dataSource?.getChildrenData({
      parentLevel: currentInfo.currentLevel,
      parentAdcode: currentInfo.currentCode,
      childrenLevel: currentLevel,
    });

    setLayerSource((prevState: any) => ({
      ...prevState,
      data,
    }));
  };

  const items: LayerPopupProps['items'] = useMemo(() => {
    return item();
  }, [dataInfo.sourceType, dataInfo.currentLevel]);
  return (
    <Spin spinning={false}>
      <div
        style={{
          display: 'flex',
        }}
      >
        <LarkMap
          {...config}
          style={{
            height: 'calc(100vh - 180px)',
            width: 'calc(100% - 300px)',
          }}
        >
          <ChoroplethLayer
            {...layerOptions}
            source={layerSource}
            onDblClick={onDblClick}
            onUndblclick={onUndblclick}
            id="myChoroplethLayer"
          />
          <LayerPopup
            closeButton={false}
            closeOnClick={false}
            anchor="bottom-left"
            trigger="hover"
            items={items}
          />
          <MapThemeControl position="bottomright" />
        </LarkMap>
        <div className="panel">
          <Row className="row">
            <Col span={8} className="label">
              版本：
            </Col>
            <Col span={16} style={{ textAlign: 'right' }}>
              <Select
                value={dataInfo.sourceVersion}
                size={'small'}
                onChange={onDataConfigChange.bind(null, 'sourceVersion')}
                options={editionOptions[dataInfo.sourceType]}
              />
            </Col>
          </Row>
          <Divider style={{ margin: '8px 0' }}></Divider>

          <Descriptions title="当前地区">
            <Descriptions.Item style={{ width: '180px' }} label="名称">
              {dataInfo.currentName}
            </Descriptions.Item>
            <Descriptions.Item label="adcode">
              {dataInfo.currentCode}
            </Descriptions.Item>
          </Descriptions>

          <Row className="row">
            <Col span={12} className="label">
              包含子区域:
            </Col>
            <Col span={12} style={{ textAlign: 'right' }}>
              <Switch
                style={{ width: '32px' }}
                checked={dataInfo.hasSubChildren}
                onChange={onDataConfigChange.bind(null, 'hasSubChildren')}
              />
            </Col>
          </Row>

          {dataInfo.hasSubChildren && (
            <Row className="row">
              <Col span={10} className="label">
                子区域级别:
              </Col>
              <Col span={14} style={{ textAlign: 'right' }}>
                <Radio.Group
                  defaultValue={childrenLevelList[0] || 'province'}
                  size={size}
                  value={dataInfo.childrenLevel}
                  onChange={(e) => {
                    onDataConfigChange('childrenLevel', e.target.value);
                  }}
                >
                  {childrenLevelList.indexOf('province') !== -1 && (
                    <Radio.Button value="province">省</Radio.Button>
                  )}
                  {childrenLevelList.indexOf('city') !== -1 && (
                    <Radio.Button value="city">市</Radio.Button>
                  )}
                  <Radio.Button value="county">县</Radio.Button>
                </Radio.Group>
              </Col>
            </Row>
          )}

          <Row className="row">
            <Col span={6} className="label">
              数据下载:
            </Col>
            <Col span={18} style={{ textAlign: 'right' }}>
              <Select
                value={dataInfo.datatype}
                style={{ width: 120 }}
                size={size}
                options={downloadDataType}
                onChange={onDataConfigChange.bind(null, 'datatype')}
              />

              <Button
                type="primary"
                style={{ marginLeft: '8px' }}
                icon={<DownloadOutlined />}
                size={size}
                onClick={onDownload}
              />

              <Button
                type="primary"
                style={{ marginLeft: '8px' }}
                icon={<CopyOutlined />}
                onClick={onCopyData}
                size={size}
              />
            </Col>
          </Row>
          <Row className="row">
            <Col span={6} className="label">
              SVG下载:
            </Col>
            <Col span={18} style={{ textAlign: 'right' }}>
              <Button style={{ pointerEvents: 'none', width: 120 }}>
                {' '}
                <PictureOutlined /> SVG{' '}
              </Button>
              <Button
                type="primary"
                style={{ marginLeft: '8px' }}
                icon={<DownloadOutlined />}
                size={size}
                onClick={onDownloadSvg}
              />

              <Button
                type="primary"
                style={{ marginLeft: '8px' }}
                icon={<CopyOutlined />}
                onClick={onCopySvg}
                size={size}
              />
            </Col>
          </Row>
          <Row className="row">
            <Col span={12} className="label">
              中国边界下载{' '}
              <Tooltip
                placement="top"
                overlayInnerStyle={{
                  color: '#111',
                }}
                color={'#fff'}
                title={
                  '全国边界下载：包含国界线、海岸线、香港界、海上省界、未定国界等线要素.'
                }
              >
                {' '}
                <InfoCircleOutlined />
              </Tooltip>
            </Col>
            <Col span={12} style={{ textAlign: 'right' }}>
              <Button
                type="primary"
                style={{ marginLeft: '8px' }}
                icon={<DownloadOutlined />}
                onClick={onDownloadGUOJIE}
                size={size}
              />
            </Col>
          </Row>

          {/* 全国边界下载：包含国界线、海岸线、香港界、海上省界、未定国界等线要素 */}
          <div className="originData" style={{}}>
            <div>数据来源：</div>
            <a
              href={`${dataSource?.info?.desc?.href}`}
            >{`${dataSource?.info?.desc?.text}`}</a>
          </div>
        </div>
      </div>
    </Spin>
  );
};
