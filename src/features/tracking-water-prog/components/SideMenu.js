import React, {useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Switch, Text} from 'react-native';
import Modal from 'react-native-modal';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Title, Button, Chip, Snackbar, Portal} from 'react-native-paper';
import ChangeTargetDialog from './ChangeTargetDialog';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTheme} from 'styled-components';
import {DEFAULT_GOAL, IS_NOTIFICATION_ALLOWED} from '../../../constants';

const SettingItem = ({name, unit = '', value = '', onClick = null}) => {
  const theme = useTheme();
  return (
    <View style={styles.settingItemWrapper}>
      <Text style={styles.settingName}>{name}</Text>
      <TouchableOpacity style={styles.btn} onPress={onClick}>
        <Text style={styles.settingValue(theme)}>{`${value} ${unit}`}</Text>
      </TouchableOpacity>
    </View>
  );
};
const SettingItemWithButton = ({name, onClick, defaultSwitchValue = false}) => {
  const [isEnabled, setIsEnabled] = useState(defaultSwitchValue);
  const theme = useTheme();
  return (
    <View style={styles.settingItemWrapper}>
      <Text style={styles.settingName}>{name}</Text>
      <Switch
        trackColor={{false: '#767577', true: '#81b0ff'}}
        thumbColor={isEnabled ? theme.waterTracking.primary : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={value => {
          setIsEnabled(value);
          onClick(value);
        }}
        value={isEnabled}
      />
    </View>
  );
};
const SideMenu = ({isVisible, onClose}) => {
  const [isTargetDialogVisible, setIsTargetDialogVisible] = useState(false);
  const [isNotificationAllowed, setIsNotificationAllowed] = useState(false);
  const [dailyValue, setDailyValue] = useState(0);
  const [timerValue, setTimerValue] = useState(15);

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
          await AsyncStorage.setItem(IS_NOTIFICATION_ALLOWED, 'allow');
        } else {
          await AsyncStorage.removeItem(IS_NOTIFICATION_ALLOWED);
        }
      },
    },
  ];
  const notificationSettings2 = [
    {
      name: 'Start time',
      value: timerValue,
      onClick: () => {
        setIsTargetDialogVisible(true);
      },
      unit: 'hour',
    },
    {
      name: 'Repeat interval',
      value: timerValue,
      onClick: () => {
        setIsTargetDialogVisible(true);
      },
    },
  ];
  useEffect(() => {
    (async () => {
      const values = await AsyncStorage.multiGet([
        DEFAULT_GOAL,
        IS_NOTIFICATION_ALLOWED,
      ]);

      if (values[0][1] != null) {
        setDailyValue(JSON.parse(values[0][1]));
      }
      if (values[1][1] != null) {
        setIsNotificationAllowed(true);
      }
    })();
  }, []);

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
