import {createSlice} from '@reduxjs/toolkit';
import {addTask, getTask, updateTaskStatus} from './thunks/todolistActions';

const initialState = {
  tasks: [],
  isLoading: false,
  error: null
};

const actions = [addTask, getTask, updateTaskStatus];

const todolistSlice = createSlice({
  name: 'todolist',
  initialState: initialState,
  reducers: {},
  extraReducers: builder => {
    actions.forEach(action => {
      builder
        .addCase(action.pending, state => {
          state.isLoading = true;
        })
        .addCase(action.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.error.message;
        });
    });
    builder
      // .addCase(addTask.pending, state => {
      //   state.isLoading = true;
      // })
      // .addCase(addTask.rejected, (state, action) => {
      //   state.isLoading = false;
      //   state.error = action.error.message;
      //   console.log('Add task error:', action.error);
      // })
      .addCase(addTask.fulfilled, (state, {payload}) => {
        state.isLoading = false;
        state.tasks.push(payload);
      })
      // .addCase(getTask.pending, state => {
      //   state.isLoading = true;
      // })
      // .addCase(getTask.rejected, (state, action) => {
      //   state.isLoading = false;
      //   state.error = action.error.message;
      //   console.log('Get task error:', action.error);
      // })
      .addCase(getTask.fulfilled, (state, {payload}) => {
        state.isLoading = false;
        state.tasks = payload;
      })
      .addCase(updateTaskStatus.fulfilled, (state, payload) => {
        state.isLoading = false;
        const index = state.tasks.findIndex(
          task => task.id === payload.payload.taskId
        );
        console.log('task55', state.tasks[index]);
        state.tasks[index].isComplete = payload.payload.data.isComplete;
      });
  }
});

export default todolistSlice;
