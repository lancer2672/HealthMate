import React, {useEffect, useCallback} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import messaging from '@react-native-firebase/messaging';
import {AppState} from 'react-native';

import {getMessagingToken, setUpMessagingListener} from '../services/firebase';
import {saveFCMToken} from 'src/store/reducer/thunks/userActions';
import Login from '../features/auth/screens/SignIn.screen';
import WaterTracking from '../features/tracking-water-prog/screens/WaterTracking.screen';
import CheckCalories from '../features/food/screens/CheckCalories.screen';
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
      initialRouteName="CheckCalories">
      <Stack.Screen name="AppTabs" component={WaterTracking} />
      <Stack.Screen name="WaterTracking" component={WaterTracking} />
      <Stack.Screen name="StepCounter" component={StepCounter} />
      <Stack.Screen
        name="WaterTrackingHistory"
        component={WaterTrackingHistory}
      />
      <Stack.Screen name="CheckCalories" component={CheckCalories} />
    </Stack.Navigator>
  );
};
