import messaging from '@react-native-firebase/messaging';
export const getMessagingToken = saveFCMtoken => {
  // Get the device token
  messaging()
    .getToken()
    .then(token => {
      console.log('Messaging Token', token);
      saveFCMtoken(token);
    })
    .catch(er => {
      console.log('get messaging token failed', er);
    });
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.notification,
    );
    switch (remoteMessage.data.type) {
      case 'chat': {
        navigation.navigate('ChatRoom', {
          channelId: remoteMessage.data.channelId,
          memberIds: JSON.parse(remoteMessage.data.memberIds),
        });
        break;
      }
      case 'post/react': {
        // navigation.navigate("DetailPost", {
        //   channelId: remoteMessage.data.channelId,
        //   memberIds: JSON.parse(remoteMessage.data.memberIds),
        // });
      }
    }
  });
  return messaging().onTokenRefresh(token => {
    saveFCMtoken(token);
  });
};
