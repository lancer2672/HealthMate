import React, {useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Switch, Text} from 'react-native';
import {useTheme} from 'styled-components';

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

const styles = StyleSheet.create({
  setting: {
    fontSize: 32,
    fontWeight: 'bold',
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
export {SettingItemWithButton, SettingItem};
