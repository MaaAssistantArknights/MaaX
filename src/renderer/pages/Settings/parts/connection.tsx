import * as React from 'react';
import _ from 'lodash';
import type { Type as ConnectionType } from 'common/storage/configuration/connection';
import { Divider, Space, Typography, Input } from 'antd';

type ConnectionProps = {
  conf: ConnectionType;
  onChange: (conf: ConnectionType) => void;
};

class Connection extends React.PureComponent<ConnectionProps> {
  render() {
    const { conf, onChange } = this.props;
    const config = _.cloneDeep(conf);
    return (
      <div id="connection" className="setting-catetory">
        <Divider>连接设置</Divider>
        <Typography.Paragraph>
          Tips: 以下设置均需要自行下载ADB
          <br />
          将platform-tools文件夹解压到本软件的同级目录
        </Typography.Paragraph>
        <Space direction="vertical">
          <Space>
            <Typography.Text>自定义地址</Typography.Text>
            <Input
              value={config.address}
              onChange={(e) => {
                config.address = e.target.value;
                onChange(config);
              }}
            />
          </Space>
          <Space>
            <Typography.Text>
              bluestacks.conf
              <br />
              文件路径
            </Typography.Text>
            <Input
              value={config['Filepath of bluestack.conf']}
              onChange={(e) => {
                config['Filepath of bluestack.conf'] = e.target.value;
                onChange(config);
              }}
            />
          </Space>
        </Space>
      </div>
    );
  }
}

export default Connection;
