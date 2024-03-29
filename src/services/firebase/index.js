import {DB_URL} from '@env';
import {firebase} from '@react-native-firebase/database';
import messaging from '@react-native-firebase/messaging';
import storage from '@react-native-firebase/storage';
export const firebaseDatabase = firebase.app().database(DB_URL);

export async function saveImageFile(userId, image) {
  try {
    console.log({userId, image});
    const reference = storage().ref(`${userId}/${image.path}`);
    await reference.putFile(image.path);
    const url = await reference.getDownloadURL();
    console.log('Image URL:', url);
    return url;
  } catch (er) {
    console.log('Upload image error', er);
  }
}

export const getMessagingToken = async () => {
  // Get the device token
  try {
    const token = await messaging().getToken();
    return token;
  } catch (er) {
    console.log('Get FCM token failed', er);
  }
};

export const setUpMessagingListener = () => {
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.notification
    );
    switch (remoteMessage.data.type) {
      case 'chat': {
        navigation.navigate('ChatRoom', {
          channelId: remoteMessage.data.channelId,
          memberIds: JSON.parse(remoteMessage.data.memberIds)
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
};
