import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TasksState {
  tasks: Array<TaskRunningType>;
}

const initialState: TasksState = {
  tasks: window.$storage.get('task').map((v: any) => ({
    status: 'normal',
    progress: 0,
    ...v,
  })),
};

export const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<Array<TaskRunningType>>) => {
      state.tasks = action.payload;
    },
  },
});

export const { setTasks } = tasksSlice.actions;

export default tasksSlice.reducer;
