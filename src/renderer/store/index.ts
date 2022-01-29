import { configureStore } from '@reduxjs/toolkit';

import stagesReducer from './slices/stages';
import tasksReducer from './slices/tasks';

const store = configureStore({
  reducer: {
    stages: stagesReducer,
    tasks: tasksReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
