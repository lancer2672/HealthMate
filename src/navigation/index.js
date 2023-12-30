import {NavigationContainer} from '@react-navigation/native';
import {useEffect} from 'react';
import {ActivityIndicator, StatusBar, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import {AuthNavigator} from './Auth.navigation';
// import {AppNavigator} from './app.navigator';
import auth from '@react-native-firebase/auth';
import {getUserData} from 'src/services/firebase/firestore/user';
import {setPlans, setWorkoutPlan} from 'src/store/reducer/exerciseSlice';
import {setUser} from '../store/reducer/userSlice';
import {AppNavigator} from './App.navigation';

StatusBar.setBackgroundColor('black');
const Navigator = () => {
  const {user} = useSelector(state => state.user);
  const appState = useSelector(state => state.app);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const user = auth().currentUser;
      let data = await getUserData(user.uid);
      if (!data) data = {};

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
