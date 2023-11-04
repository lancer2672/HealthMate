import {configureStore, ThunkAction, Action} from '@reduxjs/toolkit';
import {userSlice} from './reducer/userSlice';
import {activitySlice} from './reducer/activitySlice';
import {waterTrackingSlice} from './reducer/waterTrackingSlice';
import {appSlice} from './reducer/appSlice';

const store = configureStore({
  reducer: {
    app: appSlice.reducer,
    user: userSlice.reducer,
    waterTracking: waterTrackingSlice.reducer,
    activity: activitySlice.reducer
  },
  devTools: true,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({serializableCheck: false})
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
export default store;
