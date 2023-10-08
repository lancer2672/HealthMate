import AsyncStorage from '@react-native-async-storage/async-storage';
import {createSlice} from '@reduxjs/toolkit';
import {
  addHistory,
  addSession,
  getHistoryByDate,
  setHistoryGoal,
} from './thunks/waterTrackingActions';
const initialState = {
  todayProgress: {},
  waterTracking: null,
  isLoading: false,
  error: null,
};

const actions = [addHistory, getHistoryByDate, setHistoryGoal, addSession];

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
    builder.addCase(getHistoryByDate.fulfilled, (state, {payload}) => {
      console.log('getHistoryByDate', payload);
      state.todayProgress = payload;
    });
    builder.addCase(addSession.fulfilled, (state, {payload}) => {
      console.log('addSession', payload);
      state.todayProgress = payload;
    });
    builder.addCase(setHistoryGoal.fulfilled, (state, {payload}) => {
      console.log('setHistoryGoal', payload);
      state.todayProgress = payload;
    });
  },
});

export const {} = waterTrackingSlice.actions;
