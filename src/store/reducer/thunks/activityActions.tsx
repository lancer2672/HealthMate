import {createAsyncThunk} from '@reduxjs/toolkit';
import {
  getTodayStepsGoal,
  updateUserActivity
} from '../../../services/firebase/database/activity';

export const updateUserActivityAction = createAsyncThunk<
  any,
  {userId: string, field: string, value: Number}
>('activity/updateUserActivityAction', async (data, thunkAPI) => {
  try {
    const res = await updateUserActivity(data);
    return data;
  } catch (er: any) {
    console.log('update today step error', er);
    return thunkAPI.rejectWithValue(er.message);
  }
});
export const getTodayActivityAction = createAsyncThunk<
  any,
  {userId: string, field: string, value: Number}
>('activity/getTodayActivityAction', async (data, thunkAPI) => {
  try {
    console.log('getTodayActivityAction', data);
    const res = await getTodayActivityAction(data);
    return res;
  } catch (er: any) {
    console.log('update today step error', er);
    return thunkAPI.rejectWithValue(er.message);
  }
});

export const getTodayStepGoalAction = createAsyncThunk<any, {userId: string}>(
  'activity/getTodayStepGoalAction',
  async (data, thunkAPI) => {
    try {
      const res = await getTodayStepsGoal(data);
      return res;
    } catch (er: any) {
      console.log('set step target error', er);
      return thunkAPI.rejectWithValue(er.message);
    }
  }
);
