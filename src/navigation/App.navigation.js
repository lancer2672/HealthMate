import React, {useEffect, useCallback} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import messaging from '@react-native-firebase/messaging';
import {AppState} from 'react-native';

import {getMessagingToken, setUpMessagingListener} from '../services/firebase';
import {saveFCMToken} from 'src/store/reducer/thunks/userActions';
import Login from '../features/auth/screens/SignIn.screen';
import DetailMealDate from '../features/meal/screens/DetailMealDate.screen';
import MealCalendar from '../features/meal/screens/MealCalendar.screen';
import SearchFood from '../features/food/screens/SearchFood.screen';
import LogFood from '../features/food/screens/LogFood.screen';
import {useDispatch, useSelector} from 'react-redux';
import {
  addSession,
  getDateProgress
} from 'src/store/reducer/thunks/waterTrackingActions';
import {
  checkForInitialNotification,
  createNotifeeChannel,
  enableForegroundNotification,
  registerForegroundService,
  trackingNotificationIns
} from '../services/notifee/notification';

import enableTrackingUserActivities from '../config/trackingActivities';
import WaterTracking from 'src/features/tracking-water-prog/screens/WaterTracking.screen';
import WaterTrackingHistory from 'src/features/tracking-water-prog/screens/History.screen';
import StepCounter from 'src/features/counting-steps/screens/StepCounter.screen';
import {useActivity} from 'src/hooks/useActivity';
import googleFit from 'react-native-google-fit';
import {activitySelector, waterTrackingSelector} from 'src/store/selectors';
import {Tabs} from './tabs';
import ExerciseHome from 'src/features/exercise/screens/ExerciseHome.screen';
import ListExercise from 'src/features/exercise/components/exercise/ListExercise';
import DetailPlan from 'src/features/exercise/screens/DetailPlan';
import DetailExercise from 'src/features/exercise/screens/DetailExercise';
import StartPlan from 'src/features/exercise/screens/DoExercise';
import ReadyExercise from 'src/features/exercise/screens/ReadyExercise';
import BreakScreen from 'src/features/exercise/screens/Break.screen';
import DoExercise from 'src/features/exercise/screens/DoExercise';
import FinishScreen from 'src/features/exercise/screens/FinishScreen';
import DetailPlaylist from 'src/features/exercise/screens/DetailPlaylist';
import SelectMusic from 'src/features/exercise/screens/SelectMusic';
import AddSongToPlaylist from 'src/features/exercise/screens/AddSongToPlaylist';
const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  const dispatch = useDispatch();
  const {user} = useSelector(state => state.user);
  const {enableActivityTracking} = useActivity();
  const {todayProgress} = useSelector(waterTrackingSelector);

  console.log('todayProgresstodayProgress', todayProgress);

  const addWaterAmount = useCallback(
    amount => {
      console.log('called', todayProgress);
      if (todayProgress && todayProgress.id) {
        dispatch(addSession({drinkProgressId: todayProgress.id, amount}));
      }
    },
    [todayProgress]
  );
  useEffect(() => {
    const now = new Date();
    const userId = user.uid;
    const dateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    //get daily water drink prog
    dispatch(getDateProgress({userId, date: dateOnly}));
    //notifee
    const unsubcribeLocalMessaging = enableForegroundNotification();
    (async () => {
      await checkForInitialNotification();
      await registerForegroundService(addWaterAmount);
      await trackingNotificationIns.checkingBatterySavingEnabled();
      await trackingNotificationIns.displayActivityTrackingNotification();
    })();
    // tracking user's activties
    const trackUserActivities = async () => {
      let isAllowed = await enableTrackingUserActivities();
      if (isAllowed) {
        enableActivityTracking();
      }
    };
    //FCM messaging
    const setupFCMMessaging = async () => {
      const FCMToken = await getMessagingToken();
      dispatch(saveFCMToken({FCMToken, userId}));
      await createNotifeeChannel();
    };

    trackUserActivities();
    setupFCMMessaging();
    setUpMessagingListener();

    const unsubscribeRemoteMessaging = messaging().onMessage(remoteMessage => {
      console.log('A new FCM message arrived!', remoteMessage);
    });

    return () => {
      messaging().onTokenRefresh(FCMToken => {
        dispatch(saveFCMToken({FCMToken, userId}));
      });
      googleFit.unsubscribeListeners();
      unsubscribeRemoteMessaging();
      unsubcribeLocalMessaging();
    };
  }, []);

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);
  }, []);
  const handleAppStateChange = async nextAppState => {
    console.log('StateChanged', nextAppState);
    if (nextAppState === 'active') {
      trackingNotificationIns.show = false;
      await trackingNotificationIns.stopForegroundService();
    } else {
      trackingNotificationIns.show = true;
      await trackingNotificationIns.displayActivityTrackingNotification();
    }
  };

  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="ExerciseHome">
      {/* <Stack.Screen name="AppTabs" component={Tabs} /> */}
      <Stack.Screen name="WaterTracking" component={WaterTracking} />
      <Stack.Screen name="ExerciseHome" component={ExerciseHome} />
      <Stack.Screen name="ListExercise" component={ListExercise} />
      <Stack.Screen name="StepCounter" component={StepCounter} />
      <Stack.Screen name="SelectMusic" component={SelectMusic} />
      <Stack.Screen name="AddSongToPlaylist" component={AddSongToPlaylist} />
      <Stack.Screen name="ReadyExercise" component={ReadyExercise} />
      <Stack.Screen name="FinishScreen" component={FinishScreen} />
      <Stack.Screen name="BreakScreen" component={BreakScreen} />
      <Stack.Screen name="DoExercise" component={DoExercise} />
      <Stack.Screen name="DetailPlan" component={DetailPlan} />
      <Stack.Screen name="DetailExercise" component={DetailExercise} />
      <Stack.Screen name="DetailPlaylist" component={DetailPlaylist} />
      <Stack.Screen
        name="WaterTrackingHistory"
        component={WaterTrackingHistory}
      />
      <Stack.Screen name="DetailMealDate" component={DetailMealDate} />
      <Stack.Screen name="MealCalendar" component={MealCalendar} />
      <Stack.Screen
        name="Search food"
        component={SearchFood}
        options={{headerShown: true, headerTitle: 'Back'}}
      />
      <Stack.Screen name="LogFood" component={LogFood} />
    </Stack.Navigator>
  );
};
