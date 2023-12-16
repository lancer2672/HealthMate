import {configureStore, ThunkAction, Action} from '@reduxjs/toolkit';
import {userSlice} from './reducer/userSlice';
import {exerciseSlice} from './reducer/exerciseSlice';
import {playlistSlice} from './reducer/playlistSlice';
import {activitySlice} from './reducer/activitySlice';
import {waterTrackingSlice} from './reducer/waterTrackingSlice';
import foodMealSlice from './reducer/foodMealSlice';
import todolistSlice from './reducer/todolistSlice';
import {appSlice} from './reducer/appSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {DEFAULT_STEP_GOAL} from 'src/constants';

const store = configureStore({
  reducer: {
    app: appSlice.reducer,
    user: userSlice.reducer,
    exercise: exerciseSlice.reducer,
    waterTracking: waterTrackingSlice.reducer,
    activity: activitySlice.reducer,
    foodMeal: foodMealSlice.reducer,
    todolist: todolistSlice.reducer,
    playlist: playlistSlice.reducer
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
