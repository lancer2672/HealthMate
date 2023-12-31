import {createAsyncThunk} from '@reduxjs/toolkit';
import {
  addPlan,
  removePlan,
  addExercise,
  removeExercise,
  updatePlanExercise,
  getUserPlan,
  updateWorkoutPlan,
  updateDailyWorkoutPlan,
  saveHistoryExercise
} from '../../../services/firebase/firestore/exercise';

export const addPlanAction = createAsyncThunk(
  'exercise/addPlan',
  async (data, thunkAPI) => {
    try {
      return await addPlan(data);
    } catch (error) {
      console.log('Add plan error', error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getPlanAction = createAsyncThunk(
  'exercise/getPlan',
  async (data, thunkAPI) => {
    try {
      return await getUserPlan(data);
    } catch (error) {
      console.log('Get plan error', error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const removePlanAction = createAsyncThunk(
  'exercise/removePlan',
  async (data, thunkAPI) => {
    try {
      return await removePlan(data);
    } catch (error) {
      console.log('Remove plan error', error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const addExerciseAction = createAsyncThunk(
  'exercise/addExercise',
  async (data, thunkAPI) => {
    try {
      return await addExercise(data);
    } catch (error) {
      console.log('Add exercise error', error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const removeExerciseAction = createAsyncThunk(
  'exercise/removeExercise',
  async (data, thunkAPI) => {
    try {
      return await removeExercise(data);
    } catch (error) {
      console.log('Remove exercise error', error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updatePlanExerciseAction = createAsyncThunk(
  'exercise/updatePlanExercise',
  async (data, thunkAPI) => {
    try {
      return await updatePlanExercise(data);
    } catch (error) {
      console.log('Update exercise error', error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateWorkoutPlanAction = createAsyncThunk(
  'exercise/updateWorkoutPlan',
  async (data, thunkAPI) => {
    try {
      return await updateWorkoutPlan(data);
    } catch (error) {
      console.log('Update exercise error', error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
export const updateDailyWorkoutPlanAction = createAsyncThunk(
  'exercise/updateDailyWorkoutPlan',
  async (data, thunkAPI) => {
    try {
      return await updateDailyWorkoutPlan(data);
    } catch (error) {
      console.log('Update exercise error', error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
export const saveHistoryExerciseAction = createAsyncThunk(
  'exercise/saveHistoryExercise',
  async (data, thunkAPI) => {
    try {
      return await saveHistoryExercise(data);
    } catch (error) {
      console.log('Save history exercise error', error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
