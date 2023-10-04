import {configureStore} from '@reduxjs/toolkit';
import {authApi} from '../features/auth/reducer/authApiSlice';
import {userSlice} from '../features/auth/reducer/userSlice';
import {appSlice} from './appSlice';
export default configureStore({
  reducer: {
    app: appSlice.reducer,
    user: userSlice.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(authApi.middleware),
});
