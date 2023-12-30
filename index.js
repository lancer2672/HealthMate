import notifee, {EventType} from '@notifee/react-native';
import database from '@react-native-firebase/database';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

database().setPersistenceEnabled(true);

notifee.onBackgroundEvent(async ({type, detail}) => {
  const {notification, pressAction} = detail;

  // Check if the user pressed the "Mark as read" action
  if (type === EventType.ACTION_PRESS && pressAction.id === 'mark-as-read') {
    // Update external API
    await fetch(`https://my-api.com/chat/${notification.data.chatId}/read`, {
      method: 'POST'
    });

    // Remove the notification
    await notifee.cancelNotification(notification.id);
  }
});

AppRegistry.registerComponent(appName, () => App);
