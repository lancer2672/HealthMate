import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import messaging from '@react-native-firebase/messaging';

import {getMessagingToken} from '../services/firebase';
import {useSaveFCMtokenMutation} from '../features/auth/reducer/userApiSlice';
import {View} from 'react-native';
import Login from '../features/auth/screens/SignIn.screen';
import WaterTracking from '../features/tracking-water-prog/screens/WaterTracking.screen';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  const [saveFCMtoken, {error}] = useSaveFCMtokenMutation();
  useEffect(() => {
    const onTokenRefresh = getMessagingToken(saveFCMtoken);
    const unsubscribeRemoteMessaging = messaging().onMessage(
      async remoteMessage => {
        console.log('A new FCM message arrived!', remoteMessage);
      },
    );
    return () => {
      onTokenRefresh();
      unsubscribeRemoteMessaging();
    };
  }, []);
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="AppTabs">
      <Stack.Screen name="AppTabs" component={WaterTracking} />
    </Stack.Navigator>
  );
};
