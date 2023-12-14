import React, {useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Switch, Text} from 'react-native';
import Modal from 'react-native-modal';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SettingItem, SettingItemWithButton} from 'src/components/SettingItem';
import {DISABLE_MUSIC} from 'src/constants';

const SideMenu = ({isVisible, onClose}) => {
  const [isHideScreen, setHideMusicScreen] = useState(false);
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

  useEffect(() => {
    (async () => {
      const hideMusic = await AsyncStorage.getItem(DISABLE_MUSIC);
      if (hideMusic) {
        setHideMusicScreen(true);
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
            alignItems: 'center'
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
    borderTopColor: 'gray',
    borderTopWidth: 1,
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
