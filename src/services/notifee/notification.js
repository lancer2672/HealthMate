import React from 'react';
import {View, Button} from 'react-native';
import notifee, {
  TriggerType,
  TimeUnit,
  EventType,
  AndroidImportance,
} from '@notifee/react-native';
import {AndroidColor} from '@notifee/react-native';

export async function createNotifeeChannel() {
  return await notifee.createChannel({
    id: 'alarm',
    name: 'Firing alarms & timers',
    lights: false,
    vibration: true,
    importance: AndroidImportance.DEFAULT,
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
          detail.blocked,
        );
        break;
      }
      case EventType.CHANNEL_GROUP_BLOCKED: {
        console.log(
          'User toggled channel group block',
          detail.channelGroup.id,
          detail.blocked,
        );
        break;
      }
    }
  });
}

export async function onCreateTriggerNotification({minutes}) {
  if (!minutes) {
    return;
  }
  // Create a time-based trigger
  const trigger = {
    type: TriggerType.INTERVAL,
    interval: minutes,
    timeUnit: TimeUnit.MINUTES,
  };
  console.log('set trigger', minutes);
  // Create a trigger notification
  return await notifee.createTriggerNotification(
    {
      title: 'Meeting with Jane',
      body: 'Today at 11:20am',
      android: {
        channelId: 'alarm',
      },
    },
    trigger,
  );
}

export async function onDisplayNotification() {
  // Request permissions (required for iOS)
  await notifee.requestPermission();

  // Display a notification
  await notifee.displayNotification({
    title: 'Notification Title',
    body: 'Main body content of the notification',
    android: {
      channelId: 'alarm',
      // smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
      // pressAction is needed if you want the notification to open the app when pressed
      pressAction: {
        id: 'default',
      },
    },
  });
}
function Screen() {
  async function onDisplayNotification() {
    // Request permissions (required for iOS)
    await notifee.requestPermission();

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    // Display a notification
    await notifee.displayNotification({
      title: 'Notification Title',
      body: 'Main body content of the notification',
      android: {
        channelId,
        smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
        // pressAction is needed if you want the notification to open the app when pressed
        pressAction: {
          id: 'default',
        },
      },
    });
  }

  return (
    <View>
      <Button
        title="Display Notification"
        onPress={() => onDisplayNotification()}
      />
    </View>
  );
}
