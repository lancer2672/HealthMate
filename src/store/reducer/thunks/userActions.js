import {createAsyncThunk} from '@reduxjs/toolkit';
import {
  loginUser,
  logout,
  registerUser,
  saveToken,
  updateUserInfo
} from '../../../services/firebase/firestore/user';

export const logoutUser = createAsyncThunk(
  'user/logout',
  async (userId, thunkAPI) => {
    try {
      return await logout({userId});
    } catch (er) {
      console.log('Logout error', er);
      return thunkAPI.rejectWithValue(er.message);
    }
  }
);

export const register = createAsyncThunk(
  'user/register',
  async (data, thunkAPI) => {
    try {
      return await registerUser(data);
    } catch (error) {
      console.log('Register error', error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
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
  async (data, thunkAPI) => {
    try {
      return await saveToken(data);
    } catch (error) {
      console.log('Save FCMToken error', error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
export const updateUserInfoAction = createAsyncThunk(
  'user/updateUserInfo',
  async (data, thunkAPI) => {
    try {
      return await updateUserInfo(data);
    } catch (error) {
      console.log('Update user info error', error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
