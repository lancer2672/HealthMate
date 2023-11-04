import {createAsyncThunk} from '@reduxjs/toolkit';
import {
  updateTotalTodaySteps,
  setStepTarget
} from '../../../services/firebase/database/activity';

export const updateTotalStepsAction = createAsyncThunk<
  any,
  {userId: string, steps: number}
>('activity/updateTotalStepsAction', async (data, thunkAPI) => {
  try {
    await updateTotalTodaySteps(data);
  } catch (er: any) {
    console.log('Logout error', er);
    return thunkAPI.rejectWithValue(er.message);
  }
});

export const setStepTargetAction = createAsyncThunk<
  any,
  {userId: string, stepTarget: number}
>('activity/setStepTargetAction', async (data, thunkAPI) => {
  try {
    await setStepTarget(data);
  } catch (er: any) {
    console.log('Logout error', er);
    return thunkAPI.rejectWithValue(er.message);
  }
});
