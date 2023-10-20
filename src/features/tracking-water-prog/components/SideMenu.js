import React, {useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import Modal from 'react-native-modal';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Title, Button, Chip, Snackbar, Portal} from 'react-native-paper';
import ChangeTargetDialog from './ChangeTargetDialog';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingItem = ({name, unit = '', value = '', onClick = null}) => {
  console.log('name', name);
  return (
    <View style={styles.settingItemWrapper}>
      <Text style={styles.settingName}>{name}</Text>
      <TouchableOpacity style={styles.btn} onPress={onClick}>
        <Text style={styles.settingValue}>{`${value} ${unit}`}</Text>
      </TouchableOpacity>
    </View>
  );
};
const SettingItemWithButton = () => {};
const SideMenu = ({isVisible, onClose}) => {
  const [isTargetDialogVisible, setIsTargetDialogVisible] = useState(false);
  const [dailyValue, setDailyValue] = useState(0);

  const settings = [
    {
      name: 'Goal of the day',
    },
    {
      name: 'Goal of the day',
    },
  ];
  useEffect(() => {
    (async () => {
      const savedGoal = await AsyncStorage.getItem('defaultGoal');
      if (savedGoal) {
        setDailyValue(JSON.parse(savedGoal));
      }
    })();
  }, []);
  const setDailyTarget = async value => {
    await AsyncStorage.setItem('defaultGoal', JSON.stringify(value));
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
        {/* Bất kỳ nội dung của menu nào bạn muốn đặt ở đây */}
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
        <SettingItem
          name="Goal of the day"
          value={dailyValue}
          onClick={() => {
            setIsTargetDialogVisible(true);
          }}
          unit="ml"></SettingItem>
        <Text style={styles.category}>Notification</Text>
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
  settingValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  btn: {
    padding: 4,
  },
});

export default SideMenu;
