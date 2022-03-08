import * as React from 'react';
import {
  Divider,
  Space,
  Checkbox,
  Typography,
  Select,
  Slider,
  InputNumber,
} from 'antd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import type { DropResult } from 'react-beautiful-dnd';
import type { Type as InfrastructureType } from 'main/storage/configuration/infrastructure';
import { reorder, getItemStyle } from 'renderer/utils/draggable';
import _ from 'lodash';

type InfrastructureProps = {
  conf: InfrastructureType;
  onChange: (conf: InfrastructureType) => void;
};

type InfrastructureState = {
  config: InfrastructureType;
};

const structureNicename: Record<string, string> = {
  ManufacturingStation: '制造站',
  TradingStation: '贸易站',
  ControlCenter: '控制中枢',
  PowerStation: '发电站',
  MeetingRoom: '会客室',
  Office: '办公室',
  Dormitory: '宿舍',
};

class Infrastructure extends React.Component<
  InfrastructureProps,
  InfrastructureState
> {
  constructor(props: InfrastructureProps) {
    super(props);
    this.state = {
      config: _.cloneDeep(props.conf),
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  onDragEnd(result: DropResult) {
    if (!result.destination) {
      return;
    }
    const { config } = this.state;
    const { onChange } = this.props;
    config.facilities = reorder(
      config.facilities,
      result.source.index,
      result.destination.index
    );
    onChange(config);
    this.setState({ config });
  }

  render() {
    const { Option } = Select;
    const { config } = this.state;
    const { onChange } = this.props;
    return (
      <div id="infrastructure" className="setting-catetory">
        <Divider>基建设置</Divider>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
          }}
        >
          <DragDropContext onDragEnd={this.onDragEnd}>
            <Droppable droppableId="setting-infrastructure-droppable">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{
                    textAlign: 'start',
                  }}
                >
                  {config.facilities.map((structure, index) => (
                    <Draggable
                      key={structure.name}
                      draggableId={structure.name}
                      index={index}
                    >
                      {(provided_, snapshot_) => (
                        <div
                          ref={provided_.innerRef}
                          {...provided_.draggableProps}
                          {...provided_.dragHandleProps}
                          style={getItemStyle(
                            snapshot_.isDragging,
                            provided_.draggableProps.style
                          )}
                        >
                          <Checkbox
                            key={structure.name}
                            checked={structure.enabled}
                            onChange={(e) => {
                              structure.enabled = e.target.checked;
                              onChange(config);
                            }}
                          >
                            {structureNicename[structure.name]}
                          </Checkbox>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <Space direction="vertical" style={{ flex: 1 }}>
            <Space direction="vertical">
              <Typography.Text>无人机用途：</Typography.Text>
              <Select
                value={config.DroneUsage}
                style={{ minWidth: '160px' }}
                onChange={(value) => {
                  config.DroneUsage = value;
                  onChange(config);
                }}
              >
                <Option value="None">不使用无人机</Option>
                <Option value="LMD">龙门币</Option>
                <Option value="Orundum">合成玉</Option>
                <Option value="Battle Record">作战记录</Option>
                <Option value="Pure Gold">赤金</Option>
                <Option value="Originium Shard">源石碎片</Option>
                <Option value="Chip">芯片</Option>
              </Select>
            </Space>
            <div>
              <Typography.Text>进驻宿舍理智阈值：</Typography.Text>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-around',
                }}
              >
                <Slider
                  min={0}
                  max={0.9}
                  step={0.1}
                  style={{ width: '100%', maxWidth: '450px' }}
                  value={config.MoodLimit}
                  onChange={(value) => {
                    config.MoodLimit = value;
                    onChange(config);
                  }}
                />
                <InputNumber
                  min={0.0}
                  max={0.9}
                  step={0.1}
                  value={config.MoodLimit}
                  onChange={(value) => {
                    config.MoodLimit = value;
                    onChange(config);
                  }}
                />
              </div>
            </div>
          </Space>
        </div>
      </div>
    );
  }
}

export default Infrastructure;
