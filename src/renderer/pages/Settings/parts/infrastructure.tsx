import * as React from 'react';
import {
  Divider,
  Space,
  Checkbox,
  Typography,
  Select,
  Slider,
  InputNumber,
} from 'antd';

import type { Type as InfrastructureType } from 'main/storage/configuration/infrastructure';
import _ from 'lodash';

type InfrastructureProps = {
  conf: InfrastructureType;
  onChange: (conf: InfrastructureType) => void;
};

const structureNicename: Record<string, string> = {
  ManufacturingStation: '制造站',
  TradingStation: '贸易站',
  ControlCenter: '控制中枢',
  PowerStation: '发电站',
  MeetingRoom: '会客室',
  Office: '办公室',
  Dormitory: '宿舍',
};

class Infrastructure extends React.PureComponent<InfrastructureProps> {
  render() {
    const { Option } = Select;
    const { conf, onChange } = this.props;
    const config = _.cloneDeep(conf);
    return (
      <div id="infrastructure" className="setting-catetory">
        <Divider>基建设置</Divider>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
          }}
        >
          <Space
            direction="vertical"
            className="container"
            style={{ textAlign: 'start' }}
          >
            {Object.keys(config.enable).map((structure) => (
              <Checkbox
                key={structure}
                checked={config.enable[structure]}
                onChange={(e) => {
                  config.enable[structure] = e.target.checked;
                  onChange(config);
                }}
              >
                {structureNicename[structure]}
              </Checkbox>
            ))}
          </Space>
          <Space direction="vertical" style={{ flex: 1 }}>
            <Space direction="vertical">
              <Typography.Text>无人机用途：</Typography.Text>
              <Select defaultValue="none" style={{ minWidth: '160px' }}>
                <Option value="none">不使用无人机</Option>
                <Option value="Trading Station">贸易站</Option>
                <Option value="Manufacturing Station">制造站</Option>
              </Select>
            </Space>
            <div>
              <Typography.Text>进驻宿舍理智阈值：</Typography.Text>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-around',
                }}
              >
                <Slider
                  min={0}
                  max={0.9}
                  step={0.1}
                  style={{ width: '100%', maxWidth: '450px' }}
                  value={config.MoodLimit}
                  onChange={(value) => {
                    config.MoodLimit = value;
                    onChange(config);
                  }}
                />
                <InputNumber
                  min={0.0}
                  max={0.9}
                  step={0.1}
                  value={config.MoodLimit}
                  onChange={(value) => {
                    config.MoodLimit = value;
                    onChange(config);
                  }}
                />
              </div>
            </div>
          </Space>
        </div>
      </div>
    );
  }
}

export default Infrastructure;
