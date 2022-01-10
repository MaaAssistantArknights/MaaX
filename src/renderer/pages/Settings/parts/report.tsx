import * as React from 'react';
import _ from 'lodash';
import type { Type as ReportType } from 'common/storage/configuration/report';
import { Divider, Space, Typography, Input } from 'antd';

type ReportProps = {
  conf: ReportType;
  onChange: (conf: ReportType) => void;
};

class Report extends React.PureComponent<ReportProps> {
  render() {
    const { conf, onChange } = this.props;
    const config = _.cloneDeep(conf);
    return (
      <div id="report" className="setting-catetory">
        <Divider>企鹅数据</Divider>
        <Space>
          <Typography.Text>
            企鹅数据汇报ID
            <br />
            （仅数字部分）
          </Typography.Text>
          <Input
            value={config.id}
            onChange={(e) => {
              config.id = e.target.value;
              onChange(config);
            }}
          />
        </Space>
      </div>
    );
  }
}

export default Report;
