import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {createAsyncThunk} from '@reduxjs/toolkit';
const usersRef = firestore().collection('user');

import {
  addNewHistory,
  addNewSession,
  getHistoryBySelectedDate,
  setGoal,
} from '../../../services/firebase/firestore/drinkTracking';

export const addHistory = createAsyncThunk(
  'user/addHistory',
  async (data, thunkAPI) => {
    try {
      return await addNewHistory(data);
    } catch (error) {
      console.log('Add history error', error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const addSession = createAsyncThunk(
  'user/addSession',
  async (data, thunkAPI) => {
    try {
      return await addNewSession(data);
    } catch (error) {
      console.log('Add session error', error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const getHistoryByDate = createAsyncThunk(
  'user/getHistoryByDate',
  async (data, thunkAPI) => {
    try {
      return await getHistoryBySelectedDate(data);
    } catch (error) {
      console.log('Get history by date error', error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const setHistoryGoal = createAsyncThunk(
  'user/setHistoryGoal',
  async (data, thunkAPI) => {
    try {
      return await setGoal(data);
    } catch (error) {
      console.log('Set history goal error', error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);
