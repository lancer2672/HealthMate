import messaging from '@react-native-firebase/messaging';
import {requestNotificationPermission} from 'src/permissions';
import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {useNavigation} from '@react-navigation/native';
import {userSelector} from 'src/store/selectors';
import notifee, {AndroidStyle} from '@notifee/react-native';

import {
  createNotifeeChannel,
  enableForegroundNotification
} from 'src/services/notifee/notification';
import {getMessagingToken, setUpMessagingListener} from 'src/services/firebase';
import {saveFCMToken} from 'src/store/reducer/thunks/userActions';
import {exerciseNotificationIns} from 'src/services/notifee/ExerciseNotification';

const useNotification = () => {
  const {user} = useSelector(userSelector);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const setupFCMMessaging = async () => {
    const FCMToken = await getMessagingToken();
    dispatch(saveFCMToken({FCMToken, userId: user.uid}));
    console.log('FCM TOKEN', FCMToken);
  };
  const handleIncomingMessage = async remoteMessage => {
    console.log('A new FCM message arrived!', remoteMessage);
    const {body, title} = remoteMessage.notification;
    await exerciseNotificationIns.displayNotification({body, title});
  };
  useEffect(() => {
    requestNotificationPermission();
    setupFCMMessaging();
    setUpMessagingListener();
    createNotifeeChannel();
    const unsubscribeRemoteMessaging = messaging().onMessage(
      handleIncomingMessage
    );
    const unsubcribeLocalMessaging = enableForegroundNotification();
    return () => {
      messaging().onTokenRefresh(FCMToken => {
        dispatch(saveFCMToken({FCMToken, userId: user.uid}));
      });
      unsubscribeRemoteMessaging();
      unsubcribeLocalMessaging();
    };
  }, []);
  return {
    // setIsBgNotificationEnable,
  };
};

export default useNotification;
