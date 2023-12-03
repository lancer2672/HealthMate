import {NavigationContainer} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {View, ActivityIndicator, StatusBar} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';

import {AuthNavigator} from './Auth.navigation';
// import {AppNavigator} from './app.navigator';
import {setIsLoading} from '../store/reducer/appSlice';
import {AppNavigator} from './App.navigation';
import auth from '@react-native-firebase/auth';
import {setUser} from '../store/reducer/userSlice';
import {setPlans, setWorkoutPlan} from 'src/store/reducer/exerciseSlice';
import {getUserData} from 'src/services/firebase/firestore/user';
StatusBar.setBackgroundColor('black');
const Navigator = () => {
  const {user} = useSelector(state => state.user);
  const appState = useSelector(state => state.app);
  const dispatch = useDispatch();
  const [userCredentials, setCredentials] = useState({});
  useEffect(() => {
    (async () => {
      const user = auth().currentUser;
      let data = await getUserData(user.uid);
      if (!data) data = {};
      console.log('user data', data);
      dispatch(setUser({user: {...user, ...data}}));
    })();
  }, []);
  console.log('user state', user);
  useEffect(() => {
    if (user) {
      dispatch(setPlans(user.plans || []));
      dispatch(setWorkoutPlan(user.workoutPlan || []));
    }
  }, [user]);
  return (
    <NavigationContainer>
      {user ? (
        <View
          style={{
            flex: 1
          }}>
          <StatusBar></StatusBar>
          <AppNavigator></AppNavigator>
        </View>
      ) : (
        <AuthNavigator></AuthNavigator>
      )}

      {appState.isLoading && (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
          }}>
          <ActivityIndicator size="large" color={'rgba(54, 100, 186,0.4)'} />
        </View>
      )}
    </NavigationContainer>
  );
};

export default Navigator;
