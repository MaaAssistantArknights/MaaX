import { Checkbox, Stack, PrimaryButton, TextField } from '@fluentui/react';

import './index.scss';

const customCheckboxLabel = () => {
  return (
    <span>
      吃理智药
      <TextField style={{ display: 'inline-block' }} inlist />个
    </span>
  );
};

export default function Home() {
  return (
    <div className="home page">
      <Stack tokens={{ childrenGap: 20 }}>
        <Stack.Item>
          <Stack tokens={{ childrenGap: 10 }} className="tasks">
            <Checkbox label="开始唤醒" />
            <Checkbox label="刷理智" />
            <Checkbox label="自动公招" />
            <Checkbox label="基建换班" />
            <Checkbox label="访问好友" />
            <Checkbox label="收取信用及购物" />
            <Checkbox label="领取日常奖励" />
          </Stack>
        </Stack.Item>
        <Stack.Item align="center">
          <Checkbox label="自动关机" />
        </Stack.Item>
        <Stack.Item align="center">
          <PrimaryButton>Link Start!</PrimaryButton>
        </Stack.Item>
      </Stack>
      <Stack tokens={{ childrenGap: 20 }}>
        <Stack.Item>
          <Checkbox onRenderLabel={customCheckboxLabel} />
        </Stack.Item>
      </Stack>
    </div>
  );
}
