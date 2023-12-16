import Sound from 'react-native-sound';
import {Alert, Vibration} from 'react-native';
let sound = new Sound(
  require('../assets/sounds/ting.wav'),
  Sound.MAIN_BUNDLE,
  error => {
    if (error) {
      console.log('failed to load the sound', error);
      return;
    }
  }
);
function notifyUser() {
  sound.play(success => {
    if (!success) {
      console.log('Sound did not play successfully');
    }
    console.log('notifyUser successfully');
  });
}

export default notifyUser;
