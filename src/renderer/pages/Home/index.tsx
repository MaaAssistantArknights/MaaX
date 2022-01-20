import * as React from 'react';
import { Checkbox, Space, Button } from 'antd';
import TaskSelector from 'renderer/components/TaskSelector';
import StageSelector from 'renderer/components/StageSelector';

import './index.less';

type HomeProps = Record<string, never>;

type HomeState = {
  autoShutdown: boolean;
};

function cb(msg: number, detail: string) {
  console.log(msg);
  console.log(detail);
}
class Home extends React.Component<HomeProps, HomeState> {
  constructor(props: HomeProps) {
    super(props);
    this.state = {
      autoShutdown: false,
    };
    this.onLinkstartBtnClicked = this.onLinkstartBtnClicked.bind(this);
  }

  onLinkstartBtnClicked() {
    window.$ipcRenderer.sendSync('linkstart');
    console.log(this.state);
  }

  render() {
    const { autoShutdown } = this.state;
    return (
      <div className="home page">
        <Space direction="vertical" align="center">
          <TaskSelector />
          <Checkbox
            checked={autoShutdown}
            onChange={(event) => {
              this.setState({ autoShutdown: event.target.checked });
            }}
          >
            自动关机
          </Checkbox>
          <Button type="primary" onClick={this.onLinkstartBtnClicked}>
            Link Start!
          </Button>
          <Button type="primary">停止</Button>
        </Space>
        <StageSelector />
      </div>
    );
  }
}

export default Home;
