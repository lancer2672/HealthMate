import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';

import {getMessagingToken, setUpMessagingListener} from '../services/firebase';
import Login from '../features/auth/screens/SignIn.screen';
import WaterTracking from '../features/tracking-water-prog/screens/WaterTracking.screen';
import {useDispatch, useSelector} from 'react-redux';
import {saveFCMToken} from '../store/reducer/thunks/userActions';
import {getDateProgress} from '../store/reducer/thunks/waterTrackingActions';
import WaterTrackingHistory from '../features/tracking-water-prog/screens/History.screen';
import StepTracking from '../features/counting-steps/screens/StepTracking.screen';
import {
  createNotifeeChannel,
  enableForegroundNotification,
  onCreateTriggerNotification,
  onDisplayNotification,
} from '../services/notifee/notification';
import WaveAnimation from '../features/tracking-water-prog/screens/Wave.screen';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  const dispatch = useDispatch();
  const {user} = useSelector(state => state.user);

  async function bootstrap() {
    const initialNotification = await notifee.getInitialNotification();
    if (initialNotification) {
      console.log(
        'Notification caused application to open',
        initialNotification.notification,
      );
      console.log(
        'Press action used to open the app',
        initialNotification.pressAction,
      );
    }
  }
  useEffect(() => {
    //notifee
    const unsubcribeLocalMessaging = enableForegroundNotification();
    //get today drink progress
    const now = new Date();
    const dateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    dispatch(
      getDateProgress({
        userId: user.uid,
        date: dateOnly,
      }),
    );

    //Firebase messaging
    (async () => {
      try {
        const FCMToken = await getMessagingToken();
        dispatch(saveFCMToken({FCMToken, userId: user.uid}));
        await createNotifeeChannel();
        await onDisplayNotification();
      } catch (er) {
        console.log(er);
      }
    })();
    setUpMessagingListener();
    const unsubscribeRemoteMessaging = messaging().onMessage(
      async remoteMessage => {
        console.log('A new FCM message arrived!', remoteMessage);
      },
    );
    bootstrap().then().catch(console.error);

    return () => {
      messaging().onTokenRefresh(FCMToken => {
        dispatch(saveFCMToken({FCMToken, userId: user.uid}));
      });
      unsubscribeRemoteMessaging();
      unsubcribeLocalMessaging();
    };
  }, []);

  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="AppTabs">
      <Stack.Screen name="AppTabs" component={WaveAnimation} />
      <Stack.Screen name="WaterTracking" component={WaterTracking} />
      <Stack.Screen name="StepTracking" component={StepTracking} />
      <Stack.Screen
        name="WaterTrackingHistory"
        component={WaterTrackingHistory}
      />
    </Stack.Navigator>
  );
};
