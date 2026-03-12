import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task } from '../interface/Task.interface';

interface TaskState {
  taskData: Task[];
}

const initialState: TaskState = {
  taskData: [],
};

const TaskSlice = createSlice({
  name: 'taskScreen',
  initialState,
  reducers: {
    setTaskData(state, action: PayloadAction<Task[]>) {
      state.taskData = action.payload;
    },
  },
});

export const { setTaskData } = TaskSlice.actions;
export const TaskReducer = TaskSlice.reducer;
