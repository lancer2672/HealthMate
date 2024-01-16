import messaging from '@react-native-firebase/messaging';
import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {requestNotificationPermission} from 'src/permissions';

import {useNavigation} from '@react-navigation/native';
import {userSelector, waterTrackingSelector} from 'src/store/selectors';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {getMessagingToken, setUpMessagingListener} from 'src/services/firebase';
import {exerciseNotificationIns} from 'src/services/notifee/ExerciseNotification';
import {trackingNotificationIns} from 'src/services/notifee/TrackingNotification';
import {
  checkForInitialNotification,
  createNotifeeChannel,
  enableForegroundNotification,
  registerForegroundService
} from 'src/services/notifee/notification';
import {saveFCMToken} from 'src/store/reducer/thunks/userActions';
import {addSession} from 'src/store/reducer/thunks/waterTrackingActions';

const NOTIFICATION_ENABLED = 'notificationEnabled';
const useNotification = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {user} = useSelector(userSelector);
  const {todayProgress} = useSelector(waterTrackingSelector);
  const [isNotificationEnabled, setNotificationEnabled] = useState(() => {
    AsyncStorage.getItem(NOTIFICATION_ENABLED)
      .then(value => (value !== null ? JSON.parse(value) : true))
      .catch(() => true);
  });

  console.log('todayProgress', todayProgress);
  const addWaterAmount = amount => {
    if (todayProgress && todayProgress.id) {
      dispatch(addSession({drinkProgressId: todayProgress.id, amount}));
    }
  };

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
  const disableNotification = async () => {
    setNotificationEnabled(() => false);
    await AsyncStorage.removeItem(NOTIFICATION_ENABLED);
  };
  useEffect(() => {
    registerForegroundService(addWaterAmount);
  }, [todayProgress]);
  useEffect(() => {
    requestNotificationPermission();
    if (isNotificationEnabled) {
      (async () => {
        await trackingNotificationIns.checkingBatterySavingEnabled();
        await trackingNotificationIns.displayActivityTrackingNotification();
        await trackingNotificationIns.updateNotification({
          water: todayProgress.totalAmount
        });
      })();
      checkForInitialNotification();

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
    }
  }, [isNotificationEnabled]);
  return {
    isNotificationEnabled,
    disableNotification
  };
};

export default useNotification;
