/**
 * compact: true
 * inline: true
 */
import { DownloadOutlined } from '@ant-design/icons';
import type { MenuProps, TabsProps } from 'antd';
import { Button, Dropdown, Tabs } from 'antd';
import React, { useState } from 'react';
import { downloadData } from '../utils/util';
import City from './city';
import County from './county';
import Province from './province';

const App: React.FC = () => {
  const [selectTab, setSelectTab] = useState('province');
  const [districtData, setDistrictData] = useState({});
  const onChange = (key: string) => {
    setSelectTab(key);
  };
  const onDataLoad = (data: any) => {
    setDistrictData({ ...districtData, ...data });
  };
  const items: TabsProps['items'] = [
    {
      key: 'province',
      label: `省级`,
      children: <Province onDataLoad={onDataLoad} />,
    },
    {
      key: 'city',
      label: `市级`,
      children: <City onDataLoad={onDataLoad} />,
    },
    {
      key: 'county',
      label: `县级`,
      children: <County onDataLoad={onDataLoad} />,
    },
  ];

  const dropDownItems: MenuProps['items'] = [
    {
      key: 'csv',
      label: 'CSV 格式',
    },
    {
      key: 'json',
      label: 'JSON 格式',
    },
  ];

  return (
    <Tabs
      tabBarExtraContent={{
        right: (
          <Dropdown
            menu={{
              items: dropDownItems,
              onClick: ({ key }) => {
                downloadData(
                  selectTab,
                  districtData[selectTab],
                  key as 'csv' | 'json',
                );
              },
            }}
            placement="bottom"
          >
            <Button
              type="primary"
              shape="round"
              icon={<DownloadOutlined />}
              size={'middle'}
            >
              导出数据
            </Button>
          </Dropdown>
        ),
      }}
      defaultActiveKey="1"
      items={items}
      size={'large'}
      style={{ height: '650px' }}
      onChange={onChange}
    />
  );
};

export default App;
