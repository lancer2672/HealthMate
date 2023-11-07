import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';

import {getMessagingToken, setUpMessagingListener} from '../services/firebase';
import {saveFCMToken} from 'src/store/reducer/thunks/userActions';
import {useDispatch, useSelector} from 'react-redux';
import {getDateProgress} from 'src/store/reducer/thunks/waterTrackingActions';
import {
  checkForInitialNotification,
  createNotifeeChannel,
  enableForegroundNotification
} from '../services/notifee/notification';
import enableTrackingUserActivities from '../config/trackingActivities';
import WaterTracking from 'src/features/tracking-water-prog/screens/WaterTracking.screen';
import WaterTrackingHistory from 'src/features/tracking-water-prog/screens/History.screen';
import StepCounter from 'src/features/counting-steps/screens/StepCounter.screen';
import {useSteps} from 'src/hooks/useStep';
import {useDistance} from 'src/hooks/useDistance';
import {useCalories} from 'src/hooks/useCalories';
import {useActivity} from 'src/hooks/useActivity';
import googleFit from 'react-native-google-fit';
const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  const dispatch = useDispatch();
  const {user} = useSelector(state => state.user);
  const {enableActivityTracking} = useActivity();

  useEffect(() => {
    const now = new Date();
    const userId = user.uid;
    const dateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    //get daily water drink prog
    dispatch(getDateProgress({userId, date: dateOnly}));
    //notifee
    const unsubcribeLocalMessaging = enableForegroundNotification();
    checkForInitialNotification().catch(console.error);
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

  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="StepCounter">
      <Stack.Screen name="AppTabs" component={WaterTracking} />
      <Stack.Screen name="WaterTracking" component={WaterTracking} />
      <Stack.Screen name="StepCounter" component={StepCounter} />
      <Stack.Screen
        name="WaterTrackingHistory"
        component={WaterTrackingHistory}
      />
    </Stack.Navigator>
  );
};
