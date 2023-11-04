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
import enableTrackingUserActivities, {
  enableStepTracking,
  getTodaySteps
} from '../config/trackingActivities';
import {addTodaySteps, setDailySteps} from 'src/store/reducer/activitySlice';
import WaterTracking from 'src/features/tracking-water-prog/screens/WaterTracking.screen';
import WaterTrackingHistory from 'src/features/tracking-water-prog/screens/History.screen';
import StepCounter from 'src/features/counting-steps/screens/StepCounter.screen';
import {updateTotalStepsAction} from 'src/store/reducer/thunks/activityActions';
import {useSteps} from 'src/hooks/useStep';
import {useMessaging} from 'src/hooks/useMessaging';
const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  const dispatch = useDispatch();
  const {user} = useSelector(state => state.user);
  const {handleUpdateTotalSteps, handleAddSteps, handleGetTodaySteps} =
    useSteps();
  const {handleSaveMessagingToken} = useMessaging();

  useEffect(() => {
    const now = new Date();
    const dateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const userId = user.uid;
    // tracking user's activties
    (async () => {
      let isAllowed = await enableTrackingUserActivities();
      if (isAllowed) {
        await enableStepTracking(handleAddSteps, handleUpdateTotalSteps);
        await handleGetTodaySteps();
      }
    })();

    //get daily water drink prog
    dispatch(getDateProgress({userId, date: dateOnly}));
    //notifee
    const unsubcribeLocalMessaging = enableForegroundNotification();
    checkForInitialNotification().catch(console.error);

    //FCM messaging

    (async () => {
      const FCMToken = await getMessagingToken();
      dispatch(saveFCMToken({FCMToken, userId}));
      await createNotifeeChannel();
    })();
    setUpMessagingListener();

    const unsubscribeRemoteMessaging = messaging().onMessage(remoteMessage => {
      console.log('A new FCM message arrived!', remoteMessage);
    });

    return () => {
      messaging().onTokenRefresh(FCMToken => {
        dispatch(saveFCMToken({FCMToken, userId}));
      });
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
