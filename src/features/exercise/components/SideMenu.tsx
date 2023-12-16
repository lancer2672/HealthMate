import React, {useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Switch, Text} from 'react-native';
import Modal from 'react-native-modal';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SettingItem, SettingItemWithButton} from 'src/components/SettingItem';
import {DISABLE_MUSIC, EXERCISE_NOTIFICATION} from 'src/constants';
import {exerciseNotificationIns} from 'src/services/notifee/ExerciseNotification';

const SideMenu = ({isVisible, onClose}) => {
  const [isHideScreen, setHideMusicScreen] = useState(false);
  const [disableNotification, setDisableNotification] = useState(false);
  const notificationSettings1 = [
    {
      name: 'Skip music selection screen',
      defaultSwitchValue: isHideScreen,
      onClick: async isAllowed => {
        if (isAllowed) {
          await AsyncStorage.setItem(DISABLE_MUSIC, 'allow');
          setHideMusicScreen(true);
        } else {
          await AsyncStorage.removeItem(DISABLE_MUSIC);
          setHideMusicScreen(false);
        }
      }
    }
  ];
  const notificationSettings2 = [
    {
      name: 'Disable group notification',
      defaultSwitchValue: disableNotification,
      onClick: async isAllowed => {
        if (isAllowed) {
          await AsyncStorage.setItem(EXERCISE_NOTIFICATION, 'allow');
          setDisableNotification(true);
          exerciseNotificationIns.show = true;
        } else {
          await AsyncStorage.removeItem(EXERCISE_NOTIFICATION);
          setDisableNotification(false);
          exerciseNotificationIns.show = false;
        }
      }
    }
  ];

  useEffect(() => {
    (async () => {
      const hideMusic = await AsyncStorage.getItem(DISABLE_MUSIC);
      const disableNotification = await AsyncStorage.getItem(
        EXERCISE_NOTIFICATION
      );
      if (hideMusic) {
        setHideMusicScreen(true);
      }
      if (disableNotification) {
        setDisableNotification(true);
      }
    })();
  }, []);
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
            borderBottomColor: 'gray',
            borderBottomWidth: 1
          }}>
          <Text style={styles.setting}>Settings</Text>
          <TouchableOpacity onPress={onClose}>
            <AntDesign name="close" size={30}></AntDesign>
          </TouchableOpacity>
        </View>

        <Text style={styles.category}>Music</Text>
        {notificationSettings1.map(item => {
          return (
            <SettingItemWithButton
              key={item.name}
              {...item}></SettingItemWithButton>
          );
        })}
        <Text style={styles.category}>Notification</Text>
        {notificationSettings2.map(item => {
          return (
            <SettingItemWithButton
              key={item.name}
              {...item}></SettingItemWithButton>
          );
        })}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    alignItems: 'flex-end'
  },
  menuContainer: {
    backgroundColor: 'white',
    width: '80%',
    padding: 8,
    height: '100%'
  },
  setting: {
    fontSize: 32,
    fontWeight: 'bold'
  },
  category: {
    fontSize: 24,

    marginTop: 8,
    fontWeight: 'bold',
    color: 'gray'
  },

  //setting item
  settingItemWrapper: {
    flexDirection: 'row',
    marginTop: 12,
    justifyContent: 'space-between'
  },
  settingName: {
    fontSize: 16
  },
  settingValue: theme => ({
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.accent
  }),
  btn: {
    padding: 4
  }
});

export default SideMenu;
