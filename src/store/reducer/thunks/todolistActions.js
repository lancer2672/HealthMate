import {createAsyncThunk} from '@reduxjs/toolkit';
import {
  addNewTask,
  getTaskByUser,
  updateTask
} from 'src/services/firebase/firestore/todolist';

export const addTask = createAsyncThunk(
  'todolist/addTask',
  async (data, thunkAPI) => {
    try {
      await addNewTask(data);
      return data;
    } catch (error) {
      console.error('Add task error:', error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getTask = createAsyncThunk(
  'todolist/getTask',
  async (data, thunkAPI) => {
    try {
      const tasks = await getTaskByUser(data.userId);
      return tasks;
    } catch (error) {
      console.error('Get task error:', error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateTaskStatus = createAsyncThunk(
  'todolist/updateTaskStatus',
  async (data, thunkAPI) => {
    try {
      console.log('data38', data);
      await updateTask(data.taskId, data.data);
      return data;
    } catch (error) {
      console.error('Update task status error:', error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
