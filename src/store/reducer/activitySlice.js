import AsyncStorage from '@react-native-async-storage/async-storage';
import {createSlice} from '@reduxjs/toolkit';
import {
  updateTotalStepsAction,
  setStepTargetAction,
} from './thunks/activityActions';
const initialState = {
  dailySteps: 0,
  stepTarget: 0,
  isLoading: false,
  error: null,
};
const actions = [updateTotalStepsAction, setStepTargetAction];
export const activitySlice = createSlice({
  name: 'activity',
  initialState,
  reducers: {
    //set credentials
    setDailySteps: (state, action) => {
      state.dailySteps = action.payload;
    },
    addTodaySteps: (state, action) => {
      state.dailySteps += action.payload;
    },
  },
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
    builder.addCase(setStepTargetAction.fulfilled, ({payload}) => {
      state.stepTarget = payload;
    });
  },
});

export const {setDailySteps, addTodaySteps} = activitySlice.actions;
