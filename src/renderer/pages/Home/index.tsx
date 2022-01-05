import * as React from 'react';
import {
  Checkbox,
  Space,
  Button,
  Cascader,
  List,
  InputNumber,
  Radio,
} from 'antd';
import PenguinStatsApi from 'renderer/api/penguin-stats';
import { StageType } from 'renderer/api/penguin-stats/stage';
import { ZoneType } from 'renderer/api/penguin-stats/zone';
import { DefaultOptionType } from 'antd/lib/select';
import TaskSelector from 'renderer/components/TaskSelector';

import './index.less';

type TaskType = {
  stageId: string;
  zoneName: string;
  stageName: string;
  times: number;
};

type HomeState = {
  rawZoneData: ZoneType[];
  rawStageData: StageType[];
  stageOptions: DefaultOptionType[];
  tasks: Array<TaskType>;
  selectedTask: TaskType | null;
};

class Home extends React.Component<Record<string, never>, HomeState> {
  constructor(props: Record<string, never>) {
    super(props);
    this.state = {
      rawZoneData: [],
      rawStageData: [],
      stageOptions: [],
      tasks: [],
      selectedTask: null,
    };
    this.onStageSelectorChanged = this.onStageSelectorChanged.bind(this);
    this.onAddTaskBtnClicked = this.onAddTaskBtnClicked.bind(this);
  }

  componentDidMount() {
    this.getStageInfo();
  }

  // ? FIXME: unknown[] or better type
  onStageSelectorChanged(value: unknown[]) {
    const { rawStageData, rawZoneData } = this.state;
    if (value.length !== 2) {
      return;
    }
    const zoneId = value[0];
    const stageId = value[1];
    const theZone = rawZoneData.find((zone) => zone.zoneId === zoneId);
    const theStage = rawStageData.find((stage) => stage.stageId === stageId);
    if (theStage && theZone) {
      this.setState({
        selectedTask: {
          stageId: theStage.stageId,
          zoneName: theZone.zoneName,
          stageName: theStage.code,
          times: 1,
        },
      });
    } else {
      this.setState({
        selectedTask: null,
      });
    }
  }

  onAddTaskBtnClicked() {
    const { tasks, selectedTask } = this.state;
    if (selectedTask) {
      tasks.push(selectedTask);
      this.setState({
        tasks,
      });
    }
  }

  onDeleteTaskBtnClicked(index: number) {
    const { tasks } = this.state;
    if (tasks.at(index)) {
      tasks.splice(index, 1);
      this.setState({
        tasks,
      });
    }
  }

  async getStageInfo() {
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
        stageOptions: options,
        rawStageData: stages,
        rawZoneData: zones,
      });
    }
  }

  render() {
    const { stageOptions, tasks } = this.state;
    return (
      <div className="home page">
        <Space direction="vertical" align="center">
          <h3>任务设置</h3>
          <TaskSelector />
          <Checkbox>自动关机</Checkbox>
          <Button type="primary">Link Start!</Button>
        </Space>
        <Space direction="vertical" align="center" style={{ flex: 1 }}>
          <h3>关卡选择</h3>
          <Space>
            <Cascader
              options={stageOptions}
              placeholder="请选择关卡"
              showSearch
              allowClear={false}
              onChange={this.onStageSelectorChanged}
            />
            <Button type="primary" onClick={this.onAddTaskBtnClicked}>
              添加
            </Button>
          </Space>
          <List
            size="small"
            dataSource={tasks}
            renderItem={(item, index) => (
              <List.Item style={{ justifyContent: 'flex-end' }}>
                <Space>
                  <span>{`${item.zoneName} / ${item.stageName}`}</span>
                  <Space>
                    <InputNumber
                      controls={false}
                      value={item.times}
                      size="small"
                    />
                    次
                  </Space>
                  <Button
                    type="primary"
                    danger
                    size="small"
                    onClick={() => this.onDeleteTaskBtnClicked(index)}
                  >
                    删除
                  </Button>
                </Space>
              </List.Item>
            )}
          />
          <Space direction="vertical" align="start">
            <Space>
              <Checkbox>可用理智液</Checkbox>
              <Radio.Group>
                <Radio value="time">过期时间优先</Radio>
                <Radio value="restore">理智回复量优先</Radio>
              </Radio.Group>
            </Space>
            <Checkbox>可用源石</Checkbox>
          </Space>
        </Space>
      </div>
    );
  }
}

export default Home;
