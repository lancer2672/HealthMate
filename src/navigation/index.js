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
StatusBar.setBackgroundColor('black');
const Navigator = () => {
  const {user} = useSelector(state => state.user);
  const appState = useSelector(state => state.app);
  const dispatch = useDispatch();
  const [userCredentials, setCredentials] = useState({});
  useEffect(() => {
    const user = auth().currentUser;
    dispatch(setUser({user}));
  });
  //   useEffect(() => {
  //     if (isSuccess && data) {
  //       dispatch(
  //         setUser({
  //           user: data.user,
  //           token: userCredentials.token,
  //           refreshToken: userCredentials.refreshToken,
  //         }),
  //       );
  //       console.log('user', data.user);
  //     }
  //     dispatch(setIsLoading(isFetching));
  //   }, [isFetching, data]);

  //   useEffect(() => {
  //     const getUser = async () => {
  //       try {
  //         const keys = ['userId', 'token', 'refreshToken'];
  //         const [userId, token, refreshToken] = await Promise.all(
  //           keys.map(key => AsyncStorage.getItem(key)),
  //         );
  //         console.log('userId', userId);
  //         console.log('token', token);
  //         dispatch(
  //           setToken({
  //             token: JSON.parse(token),
  //             refreshToken: JSON.parse(refreshToken),
  //           }),
  //         );
  //         if (userId) {
  //           setCredentials({
  //             userId: JSON.parse(userId),
  //             token: JSON.parse(token),
  //             refreshToken: JSON.parse(refreshToken),
  //           });
  //         }
  //       } catch (er) {
  //         console.log('er', er);
  //       }
  //     };
  //     getUser();
  //   }, []);

  return (
    <NavigationContainer>
      {user ? (
        <View
          style={{
            flex: 1,
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
            right: 0,
          }}>
          <ActivityIndicator size="large" color={'rgba(54, 100, 186,0.4)'} />
        </View>
      )}
    </NavigationContainer>
  );
};

export default Navigator;
