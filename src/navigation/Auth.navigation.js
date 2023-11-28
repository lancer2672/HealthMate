import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Login from '../features/auth/screens/SignIn.screen';
import Register from '../features/auth/screens/SignUp.screen';
const Stack = createNativeStackNavigator();

export const AuthNavigator = () => (
  <Stack.Navigator
    initialRouteName="Login"
    screenOptions={{
      headerShown: false
    }}>
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="Register" component={Register} />
    {/* <Stack.Screen name="Register1" component={RegisterScreen1} />
    <Stack.Screen name="Register2" component={RegisterScreen2} />
    <Stack.Screen name="Verification" component={Verification} />
    <Stack.Screen name="ForgotPassword" component={ForgotPassword} /> */}
  </Stack.Navigator>
);
