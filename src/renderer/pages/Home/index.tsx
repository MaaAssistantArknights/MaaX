import { Checkbox, Space, Button, InputNumber } from 'antd';

import './index.less';

export default function Home() {
  return (
    <div className="home page">
      <Space direction="vertical" align="center">
        <Checkbox.Group>
          <Space direction="vertical" className="tasks">
            <Checkbox value="awake">开始唤醒</Checkbox>
            <Checkbox value="clear sanity">刷理智</Checkbox>
            <Checkbox value="auto recruits">自动公招</Checkbox>
            <Checkbox value="shift scheduling">基建换班</Checkbox>
            <Checkbox value="visit friends">访问好友</Checkbox>
            <Checkbox value="shopping">收取信用及购物</Checkbox>
            <Checkbox value="receive rewards">领取日常奖励</Checkbox>
          </Space>
        </Checkbox.Group>
        <Checkbox>自动关机</Checkbox>
        <Button type="primary">Link Start!</Button>
      </Space>
      <Space direction="vertical">
        <Checkbox>
          <Space>
            <span>吃理智药</span>
            <InputNumber controls={false} size="small" defaultValue={0} />
            <span>个</span>
          </Space>
        </Checkbox>
      </Space>
    </div>
  );
}
