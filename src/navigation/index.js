import {NavigationContainer} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {View, ActivityIndicator, StatusBar} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';

import {AuthNavigator} from './Auth.navigation';
// import {AppNavigator} from './app.navigator';
import {useGetUserByIdQuery} from '../features/auth/reducer/userApiSlice';
import {setToken, setUser} from '@src/store/slices/userSlice';
import {setIsLoading} from '../store/appSlice';
import {AppNavigator} from './App.navigation';
StatusBar.setBackgroundColor('black');
const Navigator = () => {
  const userState = useSelector(state => state.user);
  const appState = useSelector(state => state.app);
  const dispatch = useDispatch();
  const [userCredentials, setCredentials] = useState({});
  const {
    data,
    isSuccess,
    refetch,
    isLoading: isFetching,
    error,
  } = useGetUserByIdQuery(userCredentials.userId, {
    skip: !userCredentials.userId,
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

  //   {userState.user ? (
  //     <View
  //       style={{
  //         flex: 1,
  //       }}>
  //       <StatusBar></StatusBar>
  //       {/* <AppNavigator></AppNavigator> */}
  //     </View>
  //   ) : (
  //       )}
  return (
    <NavigationContainer>
      {/* <AuthNavigator></AuthNavigator> */}
      <AppNavigator></AppNavigator>
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
