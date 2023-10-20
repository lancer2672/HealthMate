import AsyncStorage from '@react-native-async-storage/async-storage';
import {createSlice} from '@reduxjs/toolkit';
import {login, logoutUser, register, saveFCMToken} from './thunks/userActions';
const initialState = {
  user: null,

  isLoading: false,
  error: null,
};
const actions = [logoutUser, register, login, saveFCMToken];
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    //set credentials
    setUser: (state, action) => {
      state.user = action.payload.user;
      // state.token = action.payload.token;
    },
    setToken: (state, action) => {
      state.token = action.payload.token;
    },
    updateUserState: (state, action) => {
      state.user = action.payload;
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
    builder.addCase(logoutUser.fulfilled, state => {
      state.user = null;
      state.token = null;
    });
    builder.addCase(register.fulfilled, (state, {payload}) => {
      console.log(payload);
    });
    builder.addCase(login.fulfilled, (state, {payload}) => {
      console.log(payload);
      state.user = payload;
    });
  },
});

export const {updateUserState, setToken, setUser} = userSlice.actions;
