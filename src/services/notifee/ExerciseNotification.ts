import notifee, { AndroidImportance, AndroidStyle } from '@notifee/react-native';

class ExerciseNotification {
  notificationId: string;
  water: number;
  steps: number;
  distance: number;
  show: boolean;
  channelId: string;
  constructor() {
    this.notificationId = 'exercise';
    this.water = 0;
    this.steps = 0;
    this.distance = 0;
    this.show = true;
    this.createChannel();
  }

  async createChannel() {
    this.channelId = await notifee.createChannel({
      id: 'exercise',
      name: 'Exercise Notifications',
      importance: AndroidImportance.HIGH
    });
  }

  async displayNotification({body, title}) {
    if (!this.show) return;
    await notifee.displayNotification({
      id: this.notificationId,
      title: title,
      body: '',
      android: {
        channelId: this.channelId,
        style: {
          type: AndroidStyle.BIGTEXT,
          text: body
        }
      }
    });
  }
}

export const exerciseNotificationIns = new ExerciseNotification();
