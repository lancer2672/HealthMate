import AsyncStorage from '@react-native-async-storage/async-storage';
import {createSlice} from '@reduxjs/toolkit';
import {
  addDrinkProgress,
  addSession,
  getDateProgress,
  setDrinkGoal,
} from './thunks/waterTrackingActions';
const initialState = {
  todayProgress: {},
  waterTracking: null,
  isLoading: false,
  error: null,
};

const actions = [addDrinkProgress, getDateProgress, setDrinkGoal, addSession];

export const waterTrackingSlice = createSlice({
  name: 'waterTracking',
  initialState,
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
          console.log('water tracking err', action.error);
        });
    });
    builder.addCase(getDateProgress.fulfilled, (state, {payload}) => {
      console.log('getDateProgress', payload);
      state.todayProgress = payload;
    });
    builder.addCase(addSession.fulfilled, (state, {payload}) => {
      console.log('addSession', payload);
      state.todayProgress = payload;
    });
    builder.addCase(setDrinkGoal.fulfilled, (state, {payload}) => {
      console.log('setDrinkGoal', payload);
      state.todayProgress = payload;
    });
  },
});

export const {} = waterTrackingSlice.actions;
