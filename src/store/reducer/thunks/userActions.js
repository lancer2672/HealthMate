import {createAsyncThunk} from '@reduxjs/toolkit';
import {
  logout,
  registerUser,
  loginUser,
  saveToken,
} from '../../../services/firebase/firestore/user';

export const logoutUser = createAsyncThunk('user/logout', async () => {
  try {
    return await logout();
  } catch (er) {
    console.log('Logout error', er);
    return thunkAPI.rejectWithValue(er.message);
  }
});

export const register = createAsyncThunk(
  'user/register',
  async (data, thunkAPI) => {
    try {
      return await registerUser(data);
    } catch (error) {
      console.log('Register error', error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const login = createAsyncThunk('user/login', async (data, thunkAPI) => {
  try {
    return await loginUser(data);
  } catch (error) {
    console.log('Login error', error.message);
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const saveFCMToken = createAsyncThunk(
  'user/saveFCMToken',
  async (FCMToken, thunkAPI) => {
    try {
      return await saveToken(FCMToken);
    } catch (error) {
      console.log('Save FCMToken error', error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);
