import {configureStore} from '@reduxjs/toolkit';
import {authApi} from '../features/auth/reducer/authApiSlice';
import {userApi} from '../features/auth/reducer/userApiSlice';
import {userSlice} from '../features/auth/reducer/userSlice';
import {appSlice} from './appSlice';
export default configureStore({
  reducer: {
    app: appSlice.reducer,
    user: userSlice.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(userApi.middleware),
});
