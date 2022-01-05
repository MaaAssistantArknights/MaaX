import * as React from 'react';
import { Checkbox, Space, Button, InputNumber, Cascader } from 'antd';
import PenguinStatsApi from 'renderer/api/penguin-stats';
import { DefaultOptionType } from 'antd/lib/select';
import TaskSelector from 'renderer/components/TaskSelector';

import './index.less';

type HomeState = {
  stage: DefaultOptionType[];
};

class Home extends React.Component<Record<string, never>, HomeState> {
  constructor(props: Record<string, never>) {
    super(props);
    this.state = { stage: [] };
  }

  componentDidMount() {
    this.GetStageInfo();
  }

  async GetStageInfo() {
    const timestamp = Date.now();
    /**
     * * 关卡过滤&排序
     * * 关卡仅会显示以下类型，且按照此顺序排序
     * 1. 活动关卡
     * 2. 资源关卡（周轮换）
     * 3. 主线关卡
     * 4. 插曲/别传
     */
    const zoneTypeOrder = [
      'ACTIVITY',
      'WEEKLY',
      'MAINLINE',
      'ACTIVITY_PERMANENT',
    ];
    const zones = (await PenguinStatsApi.Zone.GetAllZones())
      .filter(
        (zone) =>
          zoneTypeOrder.indexOf(zone.type) !== -1 &&
          zone.existence &&
          zone.existence.CN.exist &&
          (!zone.existence.CN.openTime ||
            zone.existence.CN.openTime <= timestamp) &&
          (!zone.existence.CN.closeTime ||
            zone.existence.CN.closeTime >= timestamp)
      )
      .sort(
        (a, b) => zoneTypeOrder.indexOf(a.type) - zoneTypeOrder.indexOf(b.type)
      );
    const stages = (await PenguinStatsApi.Stage.GetAllStages()).filter(
      (stage) =>
        stage.existence &&
        stage.existence.CN.exist &&
        (!stage.existence.CN.openTime ||
          stage.existence.CN.openTime <= timestamp) &&
        (!stage.existence.CN.closeTime ||
          stage.existence.CN.closeTime >= timestamp)
    );
    if (zones.length && stages.length) {
      const options = zones.map((zone) => ({
        label: zone.zoneName,
        value: zone.zoneId,
        children: stages
          // 关卡放置到对应活动
          .filter((stage) => stage.zoneId === zone.zoneId)
          .map((stage) => ({ label: stage.code, value: stage.stageId })),
      }));
      this.setState({
        stage: options,
      });
    }
  }

  render() {
    const { stage } = this.state;
    return (
      <div className="home page">
        <Space direction="vertical" align="center">
          <h3>任务设置</h3>
          <TaskSelector />
          <Checkbox>自动关机</Checkbox>
          <Button type="primary">Link Start!</Button>
        </Space>
        <Space direction="vertical">
          <h3>关卡选择</h3>
          {/* <Checkbox>
            <Space>
              <span>吃理智药</span>
              <InputNumber controls={false} size="small" defaultValue={0} />
              <span>个</span>
            </Space>
          </Checkbox> */}
          <Cascader
            options={stage}
            placeholder="请选择关卡"
            showSearch
            expandTrigger="hover"
          />
        </Space>
      </div>
    );
  }
}

export default Home;
