import * as React from 'react';
import { Checkbox, Space, Button } from 'antd';
import TaskSelector from 'renderer/components/TaskSelector';
import StageSelector from 'renderer/components/StageSelector';

import './index.less';

// eslint-disable-next-line react/prefer-stateless-function
class Home extends React.Component {
  render() {
    return (
      <div className="home page">
        <Space direction="vertical" align="center">
          <TaskSelector />
          <Checkbox>自动关机</Checkbox>
          <Button type="primary">Link Start!</Button>
        </Space>
        <StageSelector />
      </div>
    );
  }
}

export default Home;
