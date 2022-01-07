import * as React from 'react';
import { Checkbox, Space, Button } from 'antd';
import TaskSelector from 'renderer/components/TaskSelector';
import StageSelector from 'renderer/components/StageSelector';

import './index.less';

type HomeProps = Record<string, never>;

type HomeState = {
  autoShutdown: boolean;
};
class Home extends React.Component<HomeProps, HomeState> {
  constructor(props: HomeProps) {
    super(props);
    this.state = {
      autoShutdown: false,
    };
  }

  render() {
    const { autoShutdown } = this.state;
    return (
      <div className="home page">
        <Space direction="vertical" align="center">
          <TaskSelector />
          <Checkbox
            value={autoShutdown}
            onChange={(event) => {
              this.setState({ autoShutdown: event.target.checked });
            }}
          >
            自动关机
          </Checkbox>
          <Button type="primary">Link Start!</Button>
        </Space>
        <StageSelector />
      </div>
    );
  }
}

export default Home;
