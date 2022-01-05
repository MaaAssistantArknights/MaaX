import * as React from 'react';
import { Checkbox } from 'antd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import type {
  DropResult,
  DraggingStyle,
  NotDraggingStyle,
} from 'react-beautiful-dnd';

import './index.less';

type TaskType = {
  label: string;
  value: string;
};

// TODO: 添加tasks Checkbox.Group的state、外部组件数据交互
type TaskSelectorState = {
  tasks: Array<TaskType>;
};

const defaultTasks: Array<TaskType> = [
  { label: '开始唤醒', value: 'awake' },
  { label: '刷理智', value: 'clear sanity' },
  { label: '自动公招', value: 'auto recruits' },
  { label: '基建换班', value: 'shift scheduling' },
  { label: '访问好友', value: 'visit friends' },
  { label: '收取信用及购物', value: 'shopping' },
  { label: '领取日常奖励', value: 'receive rewards' },
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
  Record<string, never>,
  TaskSelectorState
> {
  constructor(props: Record<string, never>) {
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
          {(provided, snapshot) => (
            <Checkbox.Group>
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
                        <Checkbox value={task.value}>{task.label}</Checkbox>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            </Checkbox.Group>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}

export default TaskSelector;
