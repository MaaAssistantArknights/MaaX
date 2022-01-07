import * as React from 'react';

import PenguinStatsApi from 'renderer/api/penguin-stats';
import { StageType } from 'renderer/api/penguin-stats/stage';
import { ZoneType } from 'renderer/api/penguin-stats/zone';
import { DefaultOptionType } from 'antd/lib/select';
import TweenOne, { AnimObjectOrArray } from 'rc-tween-one';
import Children from 'rc-tween-one/lib/plugin/ChildrenPlugin';
import {
  Button,
  Cascader,
  Checkbox,
  InputNumber,
  List,
  Radio,
  Space,
  Typography,
} from 'antd';

type StageSelectorProps = Record<string, never>;

type StageTaskType = {
  stageId: string;
  zoneName: string;
  stageName: string;
  times: number;
  sanityCost: number;
};

type StageSelectorState = {
  rawZoneData: ZoneType[];
  rawStageData: StageType[];
  stageOptions: DefaultOptionType[];
  tasks: Array<StageTaskType>;
  selectedTask: StageTaskType | null;
  animation: AnimObjectOrArray | null;
};

const animationDuration = 500;

const getTotalSanityCost = (tasks: Array<StageTaskType>): number => {
  return tasks.reduce((acc, task) => {
    return acc + task.times * task.sanityCost;
  }, 0);
};

class StageSelector extends React.Component<
  StageSelectorProps,
  StageSelectorState
> {
  constructor(props: StageSelectorProps) {
    super(props);
    TweenOne.plugins.push(Children);
    this.state = {
      rawZoneData: [],
      rawStageData: [],
      stageOptions: [],
      tasks: [],
      selectedTask: null,
      animation: null,
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
          sanityCost: theStage.apCost,
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
      const theTask = tasks.find(
        (task) => task.stageId === selectedTask.stageId
      );
      if (theTask) {
        theTask.times += 1;
      } else {
        tasks.push(selectedTask);
      }
      this.setState({
        tasks,
        animation: {
          Children: {
            value: getTotalSanityCost(tasks),
            floatLength: 0,
          },
          duration: animationDuration,
        },
      });
    }
  }

  onDeleteTaskBtnClicked(index: number) {
    const { tasks } = this.state;
    if (tasks.at(index)) {
      tasks.splice(index, 1);
      this.setState({
        tasks,
        animation: {
          Children: {
            value: getTotalSanityCost(tasks),
            floatLength: 0,
          },
          duration: animationDuration,
        },
      });
    }
  }

  onTimesInputChanged(value: number, index: number) {
    const times = Math.round(value);
    if (times <= 0) {
      return;
    }
    const { tasks } = this.state;
    const theTask = tasks.at(index);
    if (theTask) {
      theTask.times = times;
      this.setState({
        tasks,
        animation: {
          Children: {
            value: getTotalSanityCost(tasks),
            floatLength: 0,
          },
          duration: animationDuration,
        },
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
    const { stageOptions, tasks, animation } = this.state;
    return (
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
        <div>
          <Space>
            <Checkbox>可用理智液</Checkbox>
            <Radio.Group>
              <Radio value="time">过期时间优先</Radio>
              <Radio value="restore">理智回复量优先</Radio>
            </Radio.Group>
          </Space>
          <Checkbox>可用源石</Checkbox>
        </div>
        <Space style={{ color: '#aaa' }}>
          <h3 style={{ margin: 0 }}>关卡列表</h3>
          <span>消耗理智：</span>
          <TweenOne animation={animation ?? undefined}>0</TweenOne>
        </Space>
        <List
          style={{ display: tasks.length ? 'block' : 'none' }}
          size="small"
          dataSource={tasks}
          renderItem={(item, index) => (
            <List.Item style={{ justifyContent: 'flex-end' }}>
              <Space>
                <Typography.Text
                  strong
                >{`${item.zoneName} / ${item.stageName}`}</Typography.Text>
                <Space>
                  <InputNumber
                    value={item.times}
                    size="small"
                    onChange={(value) => this.onTimesInputChanged(value, index)}
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
      </Space>
    );
  }
}

export default StageSelector;
