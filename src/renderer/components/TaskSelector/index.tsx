import * as React from 'react';
import { Checkbox, Progress } from 'antd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import type { DropResult } from 'react-beautiful-dnd';
import { reorder, getItemStyle } from 'renderer/utils/draggable';
import _ from 'lodash';

import './index.less';

import { Type as TasksType } from 'main/storage/task';

type TaskSelectorProps = Record<string, never>;

type TaskSelectorState = {
  tasks: Array<TaskRunningType>;
};

const storage = window.$storage;

const storageTasks: TasksType = storage.get('task');

const defaultTasks: Array<TaskRunningType> = storageTasks.map((v) => ({
  status: 'normal',
  progress: 0,
  ...v,
}));

class TaskSelector extends React.Component<
  TaskSelectorProps,
  TaskSelectorState
> {
  saveTaskStorage: _.DebouncedFunc<() => void>;

  constructor(props: TaskSelectorProps) {
    super(props);
    this.state = {
      tasks: defaultTasks,
    };
    this.saveTaskStorage = _.debounce(() => {
      const { tasks } = this.state;
      storage.set(
        'task',
        tasks.map((v) => _.pick(v, ['label', 'value', 'enabled']))
      );
    }, 500);
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  componentDidUpdate() {
    this.saveTaskStorage();
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
                        {...provided_.draggableProps}
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
