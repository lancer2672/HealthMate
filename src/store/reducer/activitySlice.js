import {createSlice} from '@reduxjs/toolkit';
import {
  getTodayActivityAction,
  getTodayStepGoalAction,
  updateUserActivityAction
} from './thunks/activityActions';
const initialState = {
  todaySteps: 0,
  stepTarget: 0,
  moveMins: 0,
  distance: 0,
  calories: 0,
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
    },
    updateTodayActivityIndexes: (state, action) => {
      const indexes = action.payload;
      state = {...state, indexes};
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
      if (payload) {
        const {field, value} = payload;
        state[field] = value;
        console.log('updateUserActivityAction.fulfilled', state[field]);
      }
    });
    builder.addCase(getTodayActivityAction.fulfilled, (state, {payload}) => {
      console.log('getTodayActivityAction', payload);
      const {field, value} = payload;
      state[field] = value;
    });
    builder.addCase(getTodayStepGoalAction.fulfilled, (state, {payload}) => {
      console.log('getTodayActivityAction stepTarget', payload);

      state.stepTarget = payload;
    });
  }
});

export const {
  updateTodayActivity,
  updateTodayActivityIndexes,
  addTodayStep,
  setTodaySteps
} = activitySlice.actions;
