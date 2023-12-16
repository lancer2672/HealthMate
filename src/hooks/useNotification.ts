import messaging from '@react-native-firebase/messaging';
import {useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {requestNotificationPermission} from 'src/permissions';

import {useNavigation} from '@react-navigation/native';
import {userSelector, waterTrackingSelector} from 'src/store/selectors';

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

const useNotification = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {user} = useSelector(userSelector);
  const {todayProgress} = useSelector(waterTrackingSelector);

  const addWaterAmount = useCallback(
    amount => {
      console.log('called', todayProgress);
      if (todayProgress && todayProgress.id) {
        dispatch(addSession({drinkProgressId: todayProgress.id, amount}));
      }
    },
    [todayProgress]
  );
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
    (async () => {
      await trackingNotificationIns.checkingBatterySavingEnabled();
      await trackingNotificationIns.displayActivityTrackingNotification();
      await trackingNotificationIns.updateNotification({
        water: todayProgress.totalAmount
      });
    })();
    requestNotificationPermission();
    checkForInitialNotification();
    registerForegroundService(addWaterAmount);
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
