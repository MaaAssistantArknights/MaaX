import { Anchor, Checkbox, Divider, Space } from 'antd';
import * as React from 'react';

import './index.less';

type SettingsProps = Record<string, never>;

type SettingsState = Record<string, never>;

const storage = window.$storage;
const SettingCheckbox = (props: { settingKey: string; label: string }) => {
  const { settingKey, label } = props;
  return (
    <Checkbox
      checked={storage.get(settingKey)}
      onChange={(event) => {
        storage.set(settingKey, event.target.checked);
      }}
    >
      {label}
    </Checkbox>
  );
};

class Settings extends React.Component<SettingsProps, SettingsState> {
  constructor(props: SettingsProps) {
    super(props);
    this.state = {};
  }

  render() {
    const configuration = storage.get('configuration');
    return (
      <div className="settings page">
        <Anchor>
          <Anchor.Link href="#infrastructure" title="基建设置" />
          <Anchor.Link href="#recruitment" title="自动公招" />
          <Anchor.Link href="#mall" title="信用商店" />
          <Anchor.Link href="#report" title="企鹅数据" />
          <Anchor.Link href="#connection" title="连接设置" />
          <Anchor.Link href="#update" title="软件更新" />
        </Anchor>
        <div style={{ flex: 1 }}>
          <div id="infrastructure">
            <Divider>基建设置</Divider>
            <div>
              <Space direction="vertical">
                {[
                  ...Object.entries(configuration.infrastructure.enable).map(
                    (structure) => (
                      <Checkbox
                        checked={Boolean(structure[1])}
                        onChange={(event) => {
                          storage.set(
                            `configuration.infrastructure.enable.${structure[0]}`,
                            event.target.checked
                          );
                        }}
                      >
                        {structure[0]}
                      </Checkbox>
                    )
                  ),
                ]}
              </Space>
            </div>
          </div>
          <div id="recruitment" />
          <div id="mall" />
          <div id="report" />
          <div id="connection" />
          <div id="update" />
        </div>
      </div>
    );
  }
}

export default Settings;
