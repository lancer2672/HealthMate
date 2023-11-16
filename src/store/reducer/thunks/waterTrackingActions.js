import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {createAsyncThunk} from '@reduxjs/toolkit';
const usersRef = firestore().collection('waterTracking');

import {
  addNewDrinkProgress,
  addNewSession,
  getDrinkProgressByDate,
  setGoal
} from 'src/services/firebase/firestore/drinkProgress';

export const addDrinkProgress = createAsyncThunk(
  'waterTracking/addDrinkProgress',
  async (data, thunkAPI) => {
    try {
      return await addNewDrinkProgress(data);
    } catch (error) {
      console.log('Add history error', error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const addSession = createAsyncThunk(
  'waterTracking/addSession',
  async (data, thunkAPI) => {
    try {
      return await addNewSession(data);
    } catch (error) {
      console.log('Add session error', error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getDateProgress = createAsyncThunk(
  'waterTracking/getDateProgress',
  async (data, thunkAPI) => {
    try {
      return await getDrinkProgressByDate(data);
    } catch (error) {
      console.log('Get history by date error', error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const setDrinkGoal = createAsyncThunk(
  'waterTracking/setDrinkGoal',
  async (data, thunkAPI) => {
    try {
      return await setGoal(data);
    } catch (error) {
      console.log('Set dink progress goal error', error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
