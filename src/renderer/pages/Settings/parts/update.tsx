import * as React from 'react';
import _ from 'lodash';
import type { Type as UpdateType } from 'common/storage/configuration/update';
import { Divider, Space, Typography, Input, Checkbox } from 'antd';

type ReportProps = {
  conf: UpdateType;
  onChange: (conf: UpdateType) => void;
};

class Report extends React.PureComponent<ReportProps> {
  render() {
    const { conf, onChange } = this.props;
    const config = _.cloneDeep(conf);
    return (
      <div id="update" className="setting-catetory">
        <Divider>软件更新</Divider>
        <Space direction="vertical">
          <Checkbox
            checked={config.enable}
            onChange={(e) => {
              config.enable = e.target.checked;
              onChange(config);
            }}
          >
            检查测试版本更新
          </Checkbox>
          <Space>
            <Typography.Text>Proxy</Typography.Text>
            <Input
              value={config.proxy}
              onChange={(e) => {
                config.proxy = e.target.value;
                onChange(config);
              }}
            />
          </Space>
        </Space>
      </div>
    );
  }
}

export default Report;
