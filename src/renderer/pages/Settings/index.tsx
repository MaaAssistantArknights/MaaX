import {
  Anchor,
  Checkbox,
  Divider,
  Input,
  InputNumber,
  Select,
  Slider,
  Space,
  Typography,
} from 'antd';
import * as React from 'react';
import _ from 'lodash';
import { Type as ConfigurationType } from 'common/storage/configuration';

import './index.less';

type SettingsProps = Record<string, never>;

type SettingsState = {
  configuration: ConfigurationType;
};

const storage = window.$storage;

class Settings extends React.Component<SettingsProps, SettingsState> {
  saveConfiguration: _.DebouncedFunc<() => void>;

  constructor(props: SettingsProps) {
    super(props);
    this.state = {
      configuration: storage.get('configuration'),
    };

    this.saveConfiguration = _.debounce(() => {
      const { configuration } = this.state;
      storage.set('configuration', configuration);
    }, 500);
  }

  componentDidUpdate() {
    this.saveConfiguration();
  }

  render() {
    const { configuration } = this.state;
    const { Option } = Select;
    return (
      <div className="settings page">
        <div style={{ width: '80%' }}>
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
                {Object.keys(configuration.infrastructure.enable).map(
                  (structure) => (
                    <Checkbox
                      key={structure}
                      checked={configuration.infrastructure.enable[structure]}
                      onChange={(e) => {
                        configuration.infrastructure.enable[structure] =
                          e.target.checked;
                        this.setState({
                          configuration,
                        });
                      }}
                    >
                      {structure}
                    </Checkbox>
                  )
                )}
              </Space>
              <Space direction="vertical" style={{ flex: 1 }}>
                <Space direction="vertical">
                  <span>无人机用途：</span>
                  <Select defaultValue="none" style={{ minWidth: '160px' }}>
                    <Option value="none">不使用无人机</Option>
                    <Option value="Trading Station">贸易站</Option>
                    <Option value="Manufacturing Station">制造站</Option>
                  </Select>
                </Space>
                <div>
                  <span>进驻宿舍理智阈值：</span>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-around',
                    }}
                  >
                    <Slider
                      min={0}
                      max={23}
                      style={{ width: '100%', maxWidth: '450px' }}
                      value={configuration.infrastructure.MoodLimit}
                      onChange={(value) => {
                        configuration.infrastructure.MoodLimit = value;
                        this.setState({ configuration });
                      }}
                    />
                    <InputNumber
                      min={0}
                      max={23}
                      value={configuration.infrastructure.MoodLimit}
                      onChange={(value) => {
                        configuration.infrastructure.MoodLimit = value;
                        this.setState({ configuration });
                      }}
                    />
                  </div>
                </div>
              </Space>
            </div>
          </div>
          <div id="recruitment" className="setting-catetory">
            <Divider>自动公招</Divider>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-around',
              }}
            >
              <Space direction="vertical">
                <Checkbox
                  checked={configuration.recruitment.NormalTagRefreshing}
                  onChange={(e) => {
                    configuration.recruitment.NormalTagRefreshing =
                      e.target.checked;
                    this.setState({
                      configuration,
                    });
                  }}
                >
                  自动刷新3星Tags
                </Checkbox>
                <Space>
                  <span>
                    每次执行时
                    <br />
                    最大招募次数
                  </span>
                  <InputNumber
                    value={
                      configuration.recruitment.MaximumNumberOfRecruitments
                    }
                    onChange={(value) => {
                      configuration.recruitment.MaximumNumberOfRecruitments =
                        value;
                      this.setState({ configuration });
                    }}
                  />
                </Space>
              </Space>
              <Space direction="vertical">
                <Checkbox
                  checked={configuration.recruitment.recognitions['3 Stars']}
                  onChange={(e) => {
                    configuration.recruitment.recognitions['3 Stars'] =
                      e.target.checked;
                    this.setState({ configuration });
                  }}
                >
                  自动确认3星
                </Checkbox>
                <Checkbox
                  checked={configuration.recruitment.recognitions['4 Stars']}
                  onChange={(e) => {
                    configuration.recruitment.recognitions['4 Stars'] =
                      e.target.checked;
                    this.setState({ configuration });
                  }}
                >
                  自动确认4星
                </Checkbox>
                <Checkbox
                  checked={configuration.recruitment.recognitions['4 Stars']}
                  onChange={(e) => {
                    configuration.recruitment.recognitions['4 Stars'] =
                      e.target.checked;
                    this.setState({ configuration });
                  }}
                >
                  自动确认5星
                </Checkbox>
                {/* <Checkbox checked={} onChange={}></Checkbox> */}
              </Space>
            </div>
          </div>
          <div id="mall" className="setting-catetory">
            <Divider>信用商店</Divider>
            <Checkbox
              checked={configuration.mall.enable}
              onChange={(e) => {
                configuration.mall.enable = e.target.checked;
                this.setState({ configuration });
              }}
            >
              <span>
                信用商店随缘买
                <br />
                （不买碳和家具）
              </span>
            </Checkbox>
          </div>
          <div id="report" className="setting-catetory">
            <Divider>企鹅数据</Divider>
            <Space>
              <span>
                企鹅数据汇报ID
                <br />
                （仅数字部分）
              </span>
              <Input
                value={configuration.report.id}
                onChange={(e) => {
                  configuration.report.id = e.target.value;
                  this.setState({ configuration });
                }}
              />
            </Space>
          </div>
          <div id="connection" className="setting-catetory">
            <Divider>连接设置</Divider>
            <Typography.Paragraph>
              Tips: 以下设置均需要自行下载ADB
            </Typography.Paragraph>
            <Typography.Paragraph>
              将platform-tools文件夹解压到本软件的同级目录
            </Typography.Paragraph>
            <Space direction="vertical">
              <Space>
                <Typography.Text>自定义地址</Typography.Text>
                <Input
                  value={configuration.connection.address}
                  onChange={(e) => {
                    configuration.connection.address = e.target.value;
                    this.setState({ configuration });
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
                  value={configuration.connection['Filepath of bluestack.conf']}
                  onChange={(e) => {
                    configuration.connection['Filepath of bluestack.conf'] =
                      e.target.value;
                    this.setState({ configuration });
                  }}
                />
              </Space>
            </Space>
          </div>
          <div id="update" className="setting-catetory">
            <Divider>软件更新</Divider>
            <Space direction="vertical">
              <Checkbox
                checked={configuration.update.enable}
                onChange={(e) => {
                  configuration.update.enable = e.target.checked;
                  this.setState({ configuration });
                }}
              >
                检查测试版本更新
              </Checkbox>
              <Space>
                <Typography.Text>Proxy</Typography.Text>
                <Input
                  value={configuration.update.proxy}
                  onChange={(e) => {
                    configuration.update.proxy = e.target.value;
                    this.setState({ configuration });
                  }}
                />
              </Space>
            </Space>
          </div>
        </div>
        <Anchor offsetTop={40} style={{ marginTop: '40px' }}>
          <Anchor.Link href="#infrastructure" title="基建设置" />
          <Anchor.Link href="#recruitment" title="自动公招" />
          <Anchor.Link href="#mall" title="信用商店" />
          <Anchor.Link href="#report" title="企鹅数据" />
          <Anchor.Link href="#connection" title="连接设置" />
          <Anchor.Link href="#update" title="软件更新" />
        </Anchor>
      </div>
    );
  }
}

export default Settings;
