import AsyncStorage from '@react-native-async-storage/async-storage';
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
const initialState = {
  user: null,
  token: null,
  refreshToken: null,

  registrationForm: null,
};
export const logoutUser = createAsyncThunk('user/logout', async () => {
  try {
    const socket = getSocket();
    await AsyncStorage.multiRemove(['userId', 'token', 'refreshToken']);
  } catch (er) {
    console.log('Logout error', er);
  }
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    //set credentials
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
    },
    setToken: (state, action) => {
      state.token = action.payload.token;
      const refToken = action.payload.refreshToken;
      if (refToken) {
        state.refreshToken = refToken;
      }
    },
    updateUserState: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(logoutUser.fulfilled, state => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
    });
  },
});

export const {updateUserState, setToken, setUser} = userSlice.actions;
