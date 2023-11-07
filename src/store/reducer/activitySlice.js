import AsyncStorage from '@react-native-async-storage/async-storage';
import {createSlice} from '@reduxjs/toolkit';
import {
  getTodayActivityAction,
  getTodayStepGoalAction,
  updateUserActivityAction
} from './thunks/activityActions';
import {DEFAULT_STEP_GOAL} from 'src/constants';
const initialState = {
  todaySteps: 0,
  stepTarget: 0,
  isLoading: false,
  error: null
};
const actions = [
  updateUserActivityAction,
  getTodayActivityAction,
  getTodayStepGoalAction
];
export const activitySlice = createSlice({
  name: 'activity',
  initialState: initialState,
  reducers: {
    //set credentials
    setTodaySteps: (state, action) => {
      state.todaySteps = action.payload;
    },
    addTodayStep: (state, action) => {
      state.todaySteps += action.payload.steps;
    },
    updateTodayActivity: (state, action) => {
      const {field, value} = action.payload;
      state[field] = Number(value).toFixed(2);
    }
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
    builder.addCase(updateUserActivityAction.fulfilled, (state, {payload}) => {
      console.log('updateUserActivityAction', payload);
      if (payload) {
        const {field, value} = payload;
        state[field] = value;
      }
    });
    builder.addCase(getTodayActivityAction.fulfilled, (state, {payload}) => {
      console.log('getTodayActivityAction', payload);
      const {field, value} = payload;
      state[field] = value;
    });
    builder.addCase(getTodayStepGoalAction.fulfilled, (state, {payload}) => {
      state.stepTarget = payload;
    });
  }
});

export const {updateTodayActivity, addTodayStep, setTodaySteps} =
  activitySlice.actions;
