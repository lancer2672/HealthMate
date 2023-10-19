import {configureStore} from '@reduxjs/toolkit';
import {userSlice} from './reducer/userSlice';
import {waterTrackingSlice} from './reducer/waterTrackingSlice';
import {appSlice} from './reducer/appSlice';
export default configureStore({
  reducer: {
    app: appSlice.reducer,
    user: userSlice.reducer,
    waterTracking: waterTrackingSlice.reducer,
  },
  devTools: true,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({serializableCheck: false}),
});
