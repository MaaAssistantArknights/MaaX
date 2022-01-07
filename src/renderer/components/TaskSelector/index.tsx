import * as React from 'react';
import { Checkbox, Progress } from 'antd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import type {
  DropResult,
  DraggingStyle,
  NotDraggingStyle,
} from 'react-beautiful-dnd';

import './index.less';

type TaskSelectorProps = Record<string, never>;

type TaskType = {
  label: string;
  value: string;
  status: 'normal' | 'success' | 'exception';
  progress: number;
  enabled: boolean;
};

// TODO: 外部组件数据交互
type TaskSelectorState = {
  tasks: Array<TaskType>;
};

const defaultTasks: Array<TaskType> = [
  {
    label: '开始唤醒',
    value: 'awake',
    status: 'success',
    progress: 100,
    enabled: true,
  },
  {
    label: '刷理智',
    value: 'clear sanity',
    status: 'success',
    progress: 100,
    enabled: true,
  },
  {
    label: '自动公招',
    value: 'auto recruits',
    status: 'exception',
    progress: 20,
    enabled: true,
  },
  {
    label: '基建换班',
    value: 'shift scheduling',
    status: 'normal',
    progress: 60,
    enabled: true,
  },
  {
    label: '访问好友',
    value: 'visit friends',
    status: 'normal',
    progress: 70,
    enabled: true,
  },
  {
    label: '收取信用及购物',
    value: 'shopping',
    status: 'normal',
    progress: 80,
    enabled: true,
  },
  {
    label: '领取日常奖励',
    value: 'receive rewards',
    status: 'normal',
    progress: 90,
    enabled: true,
  },
];

function reorder<T>(
  list: Iterable<T> | ArrayLike<T>,
  startIndex: number,
  endIndex: number
) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

const getItemStyle = (
  isDragging: boolean,
  draggableStyle: DraggingStyle | NotDraggingStyle | undefined
) => ({
  userSelects: 'none',
  padding: '2px 0',
  filter: `opacity(${isDragging ? 0.5 : 1})`,
  ...draggableStyle,
});

class TaskSelector extends React.Component<
  TaskSelectorProps,
  TaskSelectorState
> {
  constructor(props: TaskSelectorProps) {
    super(props);
    this.state = {
      tasks: defaultTasks,
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  onDragEnd(result: DropResult) {
    let { tasks } = this.state;
    if (!result.destination) {
      return;
    }

    tasks = reorder(tasks, result.source.index, result.destination.index);

    this.setState({
      tasks,
    });
  }

  render() {
    const { tasks } = this.state;
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="task-selector-droppable">
          {(provided) => (
            <div>
              <h3 style={{ textAlign: 'center' }}>任务设置</h3>
              <div
                className="tasks"
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {tasks.map((task, index) => (
                  <Draggable
                    key={task.value}
                    draggableId={task.value}
                    index={index}
                  >
                    {(provided_, snapshot_) => (
                      <div
                        ref={provided_.innerRef}
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        {...provided_.draggableProps}
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        {...provided_.dragHandleProps}
                        style={getItemStyle(
                          snapshot_.isDragging,
                          provided_.draggableProps.style
                        )}
                      >
                        <div className="task-item">
                          <Checkbox
                            checked={task.enabled}
                            onChange={(e) => {
                              task.enabled = e.target.checked;
                              this.setState({ tasks });
                            }}
                          >
                            {task.label}
                          </Checkbox>
                          <Progress
                            type="circle"
                            width={20}
                            percent={task.progress}
                            status={task.status}
                            showInfo={task.status === 'success'}
                            strokeWidth={12}
                          />
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}

export default TaskSelector;
