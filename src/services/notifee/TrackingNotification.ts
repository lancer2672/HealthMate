import notifee, {AndroidImportance} from '@notifee/react-native';
import {Alert} from 'react-native';

class TrackingNotification {
  notificationId: string;
  water: number;
  steps: number;
  distance: number;
  show: boolean;
  channelId: string;
  constructor() {
    this.notificationId = 'notifyId';
    this.water = 0;
    this.steps = 0;
    this.distance = 0;
    this.show = false;
    this.createChannel();
  }

  async createChannel() {
    this.channelId = await notifee.createChannel({
      id: 'activity',
      name: 'Activity Notifications',
      importance: AndroidImportance.DEFAULT
    });
  }
  async checkingBatterySavingEnabled() {
    const batteryOptimizationEnabled =
      await notifee.isBatteryOptimizationEnabled();
    if (batteryOptimizationEnabled) {
      // 2. ask your users to disable the feature
      Alert.alert(
        'Restrictions Detected',
        'To ensure notifications are delivered, please disable battery optimization for the app.',
        [
          // 3. launch intent to navigate the user to the appropriate screen
          {
            text: 'OK, open settings',
            onPress: async () => await notifee.openBatteryOptimizationSettings()
          },
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel'
          }
        ],
        {cancelable: false}
      );
    }
  }
  async displayActivityTrackingNotification() {
    console.log('displayActivityTrackingNotification', this.show);
    if (!this.show) return;
    await this.displayNotification();
  }

  async updateNotification({water = null, distance = null, steps = null}) {
    this.water = water || this.water;
    this.distance = distance || this.distance;
    this.steps = steps || this.steps;

    if (!this.show) return;
    await this.displayNotification();
  }
  async stopForegroundService() {
    await notifee.stopForegroundService();
  }
  async displayNotification() {
    await notifee.displayNotification({
      id: this.notificationId,
      title: 'Theo dõi hoạt động',
      body: `💧 ${this.water} ml 🚶 ${this.distance} m &#128099 ${this.steps} step`,
      android: {
        asForegroundService: true,
        channelId: this.channelId,
        actions: [
          {
            title: '+100ml',
            pressAction: {
              id: '100'
            }
          },
          {
            title: '+200ml',
            pressAction: {
              id: '200'
            }
          },
          {
            title: 'Stop',
            pressAction: {
              id: 'stop'
            }
          }
        ]
      }
    });
  }
}

export const trackingNotificationIns = new TrackingNotification();
