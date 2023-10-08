import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import messaging from '@react-native-firebase/messaging';

import {getMessagingToken, setUpMessagingListener} from '../services/firebase';
import {View} from 'react-native';
import Login from '../features/auth/screens/SignIn.screen';
import WaterTracking from '../features/tracking-water-prog/screens/WaterTracking.screen';
import {useDispatch, useSelector} from 'react-redux';
import {saveFCMToken} from '../store/reducer/thunks/userActions';
import {getHistoryByDate} from '../store/reducer/thunks/waterTrackingActions';
import WaterTrackingHistory from '../features/tracking-water-prog/screens/History.screen';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  const dispatch = useDispatch();
  const {user} = useSelector(state => state.user);

  useEffect(() => {
    //
    const now = new Date();
    const dateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    dispatch(
      getHistoryByDate({
        userId: user.uid,
        date: dateOnly,
      }),
    );
    //Firebase messaging
    (async () => {
      const token = await getMessagingToken();
      dispatch(saveFCMToken(token));
    })();
    setUpMessagingListener();
    const unsubscribeRemoteMessaging = messaging().onMessage(
      async remoteMessage => {
        console.log('A new FCM message arrived!', remoteMessage);
      },
    );
    return () => {
      messaging().onTokenRefresh(token => {
        dispatch(saveFCMToken(token));
      });
      unsubscribeRemoteMessaging();
    };
  }, []);
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="WaterTrackingHistory">
      <Stack.Screen name="AppTabs" component={WaterTracking} />
      <Stack.Screen name="WaterTracking" component={WaterTracking} />
      <Stack.Screen
        name="WaterTrackingHistory"
        component={WaterTrackingHistory}
      />
    </Stack.Navigator>
  );
};
