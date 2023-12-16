import {PermissionsAndroid} from 'react-native';

export async function requestPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      'android.permission.health.READ_STEPS',
      {
        title: 'HealthMate Permission',
        message: 'HealthMate needs access to your health data ',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK'
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can read steps');
    } else {
      console.log('Permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
}
export async function requestActivityRecognitionPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      'android.permission.ACTIVITY_RECOGNITION',
      {
        title: 'HealthMate Permission',
        message: 'HealthMate needs access to your activity data ',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK'
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can track user activities');
      return true;
    } else {
      console.log('Permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
  return false;
}
export async function requestStoragePermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        title: 'Storage Permission',
        message: 'This app needs access to your storage.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK'
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the storage');
    } else {
      console.log('Storage permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
}

export const requestNotificationPermission = () => {
  PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
};
