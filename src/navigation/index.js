import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import {NavigationContainer} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {ActivityIndicator, StatusBar, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import GetUserInfo from 'src/features/user-info/screens/GetUserInfor.screen';
import {getUserData} from 'src/services/firebase/firestore/user';
import {setPlans, setWorkoutPlan} from 'src/store/reducer/exerciseSlice';
import SplashScreen from '../components/SplashScreen';
import OnboardComponent from '../features/onboard/Onboard.screen';
import {setUser} from '../store/reducer/userSlice';
import {AppNavigator} from './App.navigation';
import {AuthNavigator} from './Auth.navigation';

StatusBar.setBackgroundColor('black');
const SEEN_ONBOARD = 'hasSeenOnboard';
const Navigator = () => {
  const {user} = useSelector(state => state.user);
  const [isLoading, setIsLoading] = useState(true);
  const [hasSeenOnboard, setHasSeenOnboard] = useState(false);
  const appState = useSelector(state => state.app);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const user = auth().currentUser;
      if (user) {
        let data = await getUserData(user.uid);
        if (!data) data = {};
        dispatch(setUser({user: data}));
      }
      console.log('user', user);
      // dispatch(logoutUser({userId: user.uid}));
      setIsLoading(false);
    })();
  }, []);

  const handleOnboardDone = async () => {
    await AsyncStorage.setItem(SEEN_ONBOARD, 'true');
    setHasSeenOnboard(() => true);
  };

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const userHasSeenOnboard = await AsyncStorage.getItem(SEEN_ONBOARD);
      setHasSeenOnboard(() => userHasSeenOnboard);
      setIsLoading(false);
    })();
  }, []);
  useEffect(() => {
    if (user) {
      dispatch(setPlans(user.plans || []));
      dispatch(setWorkoutPlan(user.workoutPlan || []));
      setIsLoading(false);
    }
  }, [user]);
  console.log('isLoading', isLoading);

  if (isLoading) {
    return <SplashScreen></SplashScreen>;
  }
  if (!hasSeenOnboard) {
    return <OnboardComponent onDone={handleOnboardDone} />;
  }

  console.log('isLoading called', user, isLoading);
  return (
    <NavigationContainer>
      {user ? (
        user.isGetInformation ? (
          <AppNavigator />
        ) : (
          <GetUserInfo />
        )
      ) : (
        <AuthNavigator />
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
