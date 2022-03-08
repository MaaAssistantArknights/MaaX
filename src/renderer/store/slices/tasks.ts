/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Type as TaskStorageType } from 'main/storage/task';
import _ from 'lodash';
// eslint-disable-next-line import/no-cycle
import { RootState } from '..';

export type TasksState = Array<TaskRunningType>;

const initialState: TasksState = window.$storage
  .get('task')
  .map((v: TaskStorageType) => ({
    status: 'normal',
    progress: 0,
    ...v,
  }));

const syncStorage = _.debounce((state: TasksState) => {
  window.$storage.set(
    'task',
    state.map((v) => _.pick(v, ['label', 'value', 'enabled']))
  );
}, 500);

export const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<Array<TaskRunningType>>) => {
      state = action.payload;
      syncStorage(state);
    },
  },
});

export const { setTasks } = tasksSlice.actions;

export const getTasks = (state: RootState) => state.tasks;

export default tasksSlice.reducer;
