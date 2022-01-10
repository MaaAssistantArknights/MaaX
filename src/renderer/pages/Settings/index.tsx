import { Anchor } from 'antd';
import * as React from 'react';
import _ from 'lodash';
import type { Type as ConfigurationType } from 'common/storage/configuration';

import './index.less';
import Infrastructure from './parts/infrastructure';
import Recruitment from './parts/recruitment';
import Mall from './parts/mall';
import Report from './parts/report';
import Connection from './parts/connection';
import Update from './parts/update';

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
    return (
      <div className="settings page">
        <div style={{ width: '80%' }}>
          <Infrastructure
            conf={configuration.infrastructure}
            onChange={(conf) => {
              configuration.infrastructure = conf;
              this.setState({ configuration });
            }}
          />
          <Recruitment
            conf={configuration.recruitment}
            onChange={(conf) => {
              configuration.recruitment = conf;
              this.setState({ configuration });
            }}
          />
          <Mall
            conf={configuration.mall}
            onChange={(conf) => {
              configuration.mall = conf;
              this.setState({ configuration });
            }}
          />
          <Report
            conf={configuration.report}
            onChange={(conf) => {
              configuration.report = conf;
              this.setState({ configuration });
            }}
          />
          <Connection
            conf={configuration.connection}
            onChange={(conf) => {
              configuration.connection = conf;
              this.setState({ configuration });
            }}
          />
          <Update
            conf={configuration.update}
            onChange={(conf) => {
              configuration.update = conf;
              this.setState({ configuration });
            }}
          />
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
