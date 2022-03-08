import * as React from 'react';
import { Checkbox, Progress } from 'antd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import type { DropResult } from 'react-beautiful-dnd';
import { reorder, getItemStyle } from 'renderer/utils/draggable';

import { connect } from 'react-redux';
import type { RootState } from 'renderer/store';
import { bindActionCreators } from 'redux';
import type { Dispatch, AnyAction } from 'redux';
import { setTasks } from 'renderer/store/slices/tasks';
import type { ActionCreatorWithPayload } from '@reduxjs/toolkit';

import _ from 'lodash';

import './index.less';

type TaskSelectorState = {
  tasks: Array<TaskRunningType>;
};

type TaskSelectorProps = {
  tasks: Array<TaskRunningType>;
  action: ActionCreatorWithPayload<Array<TaskRunningType>>;
};

class TaskSelector extends React.Component<
  TaskSelectorProps,
  TaskSelectorState
> {
  constructor(props: TaskSelectorProps) {
    super(props);
    this.state = {
      tasks: _.cloneDeep(props.tasks),
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  onDragEnd(result: DropResult) {
    let { tasks } = this.state;
    const { action } = this.props;
    if (!result.destination) {
      return;
    }

    tasks = reorder(tasks, result.source.index, result.destination.index);

    this.setState({
      tasks,
    });
    action(tasks);
  }

  render() {
    const { tasks } = this.state;
    const { action } = this.props;
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
                              action(tasks);
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

const mapStateToProps = (state: RootState) => ({ tasks: state.tasks });

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  action: bindActionCreators(setTasks, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(TaskSelector);
