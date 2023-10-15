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
        buttonPositive: 'OK',
      },
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
