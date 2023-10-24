import React, {useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Switch, Text} from 'react-native';
import Modal from 'react-native-modal';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ChangeTargetDialog from './ChangeTargetDialog';
import notifee from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTheme} from 'styled-components';
import {
  DEFAULT_GOAL,
  IS_REMINDING_NOTIFICATION_ALLOWED,
} from '../../../constants';
import {DateTimePickerAndroid} from '@react-native-community/datetimepicker';
import {SettingItem, SettingItemWithButton} from './SettingItem';
import {onCreateTriggerNotification} from '../../../services/notifee/notification';

const getIntervalDate = () => {
  const intervalDate = new Date();
  intervalDate.setHours(0);
  intervalDate.setMinutes(15);
  intervalDate.setSeconds(0);
  return intervalDate;
};

const SideMenu = ({isVisible, onClose}) => {
  const [isTargetDialogVisible, setIsTargetDialogVisible] = useState(false);
  const [isNotificationAllowed, setIsNotificationAllowed] = useState(false);
  const [dailyValue, setDailyValue] = useState(0);
  const [intervalTime, setIntervalTime] = useState(getIntervalDate());
  const [startTime, setStartTime] = useState(new Date());
  const [notificationId, setNotificationId] = useState(null);

  const onSelectedChange = (event, selectedDate, setTime) => {
    const currentDate = selectedDate;
    setTime(currentDate);
  };
  const showTimePicker = setTime => {
    DateTimePickerAndroid.open({
      value: startTime,
      onChange: (e, s) => {
        onSelectedChange(e, s, setTime);
      },
      mode: 'time',
      is24Hour: true,
    });
  };
  const generalSettings = [
    {
      name: 'Goal of the day',
      value: dailyValue,
      onClick: () => {
        setIsTargetDialogVisible(true);
      },
      unit: 'ml',
    },
  ];

  const notificationSettings1 = [
    {
      name: 'Allow notifications',
      defaultSwitchValue: isNotificationAllowed,
      onClick: async isAllowed => {
        if (isAllowed) {
          await AsyncStorage.setItem(
            IS_REMINDING_NOTIFICATION_ALLOWED,
            'allow',
          );
          setTrigger();
        } else {
          await AsyncStorage.removeItem(IS_REMINDING_NOTIFICATION_ALLOWED);
          await notifee.cancelTriggerNotifications([notificationId]);
        }
      },
    },
  ];
  const notificationSettings2 = [
    {
      name: 'Start time',
      value: `${startTime.getHours()}h : ${startTime.getMinutes()}m`,
      onClick: () => {
        showTimePicker(setStartTime);
        setTrigger();
      },
      // unit: 'hour',
    },
    {
      name: 'Repeat interval',
      value: `${intervalTime.getHours()}h : ${intervalTime.getMinutes()}m`,
      onClick: () => {
        showTimePicker(setIntervalTime);
        setTrigger();
      },
    },
  ];
  useEffect(() => {
    (async () => {
      const values = await AsyncStorage.multiGet([
        DEFAULT_GOAL,
        IS_REMINDING_NOTIFICATION_ALLOWED,
      ]);

      if (values[0][1] != null) {
        setDailyValue(JSON.parse(values[0][1]));
      }
      if (values[1][1] != null) {
        setIsNotificationAllowed(true);
      }
      await setTrigger();
    })();
  }, []);

  const setTrigger = async () => {
    const isAllowed = await AsyncStorage.getItem(
      IS_REMINDING_NOTIFICATION_ALLOWED,
    );
    if (isAllowed) {
      const notifyId = await onCreateTriggerNotification({
        message: 'Reminder to drink water',
        minutes: intervalTime.getHours() * 60 + intervalTime.getMinutes(),
        startTime: startTime,
      });
      setNotificationId(notifyId);
    }
  };
  const setDailyTarget = async value => {
    await AsyncStorage.setItem(DEFAULT_GOAL, JSON.stringify(value));
    setDailyValue(() => value);
  };
  return (
    <Modal
      isVisible={isVisible}
      animationIn="slideInRight"
      useNativeDriver={true}
      animationOut="slideOutRight"
      onBackButtonPress={onClose}
      onBackdropPress={onClose}
      style={styles.modal}>
      <View style={styles.menuContainer}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text style={styles.setting}>Settings</Text>
          <TouchableOpacity onPress={onClose}>
            <AntDesign name="close" size={30}></AntDesign>
          </TouchableOpacity>
        </View>

        <Text style={styles.category}>General</Text>
        {generalSettings.map(item => {
          return <SettingItem key={item.name} {...item}></SettingItem>;
        })}

        <Text style={styles.category}>Notification</Text>
        {notificationSettings2.map(item => {
          return <SettingItem key={item.name} {...item}></SettingItem>;
        })}
        {notificationSettings1.map(item => {
          return (
            <SettingItemWithButton
              key={item.name}
              {...item}></SettingItemWithButton>
          );
        })}

        <ChangeTargetDialog
          onClick={setDailyTarget}
          isVisible={isTargetDialogVisible}
          onClose={() =>
            setIsTargetDialogVisible(() => false)
          }></ChangeTargetDialog>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    alignItems: 'flex-end',
  },
  menuContainer: {
    backgroundColor: 'white',
    width: '80%',
    padding: 8,
    height: '100%',
  },
  setting: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  category: {
    fontSize: 24,
    borderTopColor: 'gray',
    borderTopWidth: 1,
    marginTop: 8,
    fontWeight: 'bold',
    color: 'gray',
  },

  //setting item
  settingItemWrapper: {
    flexDirection: 'row',
    marginTop: 12,
    justifyContent: 'space-between',
  },
  settingName: {
    fontSize: 16,
  },
  settingValue: theme => ({
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.waterTracking.secondary,
  }),
  btn: {
    padding: 4,
  },
});

export default SideMenu;
