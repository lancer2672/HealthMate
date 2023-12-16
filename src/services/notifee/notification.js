import {AppState, Alert} from 'react-native';
import notifee, {
  TriggerType,
  TimeUnit,
  EventType,
  AndroidImportance,
  RepeatFrequency,
  AndroidStyle
} from '@notifee/react-native';

export async function checkForInitialNotification() {
  const initialNotification = await notifee.getInitialNotification();
  if (initialNotification) {
    console.log(
      'Notification caused application to open',
      initialNotification.notification
    );
    console.log(
      'Press action used to open the app',
      initialNotification.pressAction
    );
  }
}

export async function createNotifeeChannel() {
  console.log('createNotifeeChannel');
  return await notifee.createChannel({
    id: 'alarm',
    name: 'Firing alarms & timers',
    lights: false,
    vibration: true,
    importance: AndroidImportance.DEFAULT
  });
}

export function enableForegroundNotification() {
  return notifee.onForegroundEvent(({type, detail}) => {
    switch (type) {
      case EventType.DISMISSED:
        console.log('User dismissed notification', detail.notification);
        break;
      case EventType.PRESS:
        console.log('User pressed notification', detail.notification);
        break;
      case EventType.APP_BLOCKED: {
        console.log('User toggled app blocked', detail.blocked);
        break;
      }
      case EventType.CHANNEL_BLOCKED: {
        console.log(
          'User toggled channel block',
          detail.channel.id,
          detail.blocked
        );
        break;
      }
      case EventType.CHANNEL_GROUP_BLOCKED: {
        console.log(
          'User toggled channel group block',
          detail.channelGroup.id,
          detail.blocked
        );
        break;
      }
    }
  });
}

export async function onCreateTriggerNotification({
  startTime,
  message,
  minutes
}) {
  if (!minutes) {
    return;
  }
  // Create a time-based trigger
  const trigger = {
    id: '123',
    timestamp: startTime.getTime(),
    type: TriggerType.INTERVAL,
    interval: minutes,
    timeUnit: TimeUnit.MINUTES,
    repeatFrequency: RepeatFrequency.DAILY
  };

  console.log('set trigger', minutes);
  // Create a trigger notification
  return await notifee.createTriggerNotification(
    {
      id: '111',
      title: 'HeathMate',
      body: message,
      android: {
        channelId: 'alarm'
      }
    },
    trigger
  );
}

export const registerForegroundService = addWaterAmount => {
  console.log('notificationregister');

  notifee.registerForegroundService(notification => {
    console.log('notification', notification);
    return new Promise(() => {
      notifee.onForegroundEvent(async ({type, detail}) => {
        if (
          type === EventType.ACTION_PRESS &&
          detail.pressAction.id === 'stop'
        ) {
          await notifee.stopForegroundService();
        }
      });
      notifee.onBackgroundEvent(async ({type, detail}) => {
        notifee.onBackgroundEvent(async ({type, detail}) => {
          if (type === EventType.ACTION_PRESS) {
            switch (detail.pressAction.id) {
              case 'stop':
                await notifee.stopForegroundService();
                console.log('Clicked stop');

                trackingNotificationIns.show = false;
                break;
              case '100':
                addWaterAmount(100);
                console.log('Clicked 100');

                break;
              case '200':
                addWaterAmount(200);
                console.log('Clicked 200');
                break;
              default:
                console.log('No handler for this action');
            }
          }
        });
      });
    });
  });
  console.log('notificationregister1');
};
