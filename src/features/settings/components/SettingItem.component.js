import {useState} from 'react';
import {Switch, Text, TouchableOpacity, View} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';

const SettingItemWithSwitch = ({
  name,
  icon,
  iconColor,
  backgroundIconColor,
  onClick,
  selectionName = '',
  defaultSwitchValue = false
}) => {
  const [isEnabled, setIsEnabled] = useState(defaultSwitchValue);

  return (
    <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
      <View
        style={{
          backgroundColor: backgroundIconColor,
          padding: 8,
          borderRadius: 25,
          marginRight: 12
        }}>
        <Entypo name={icon} size={20} color={iconColor} />
      </View>
      <View style={{flex: 1}}>
        <Text style={{color: 'black'}}>{name}</Text>
      </View>
      <Text style={{color: 'black'}}>{selectionName}</Text>
      <Switch
        trackColor={{false: '#767577', true: '#81b0ff'}}
        thumbColor={isEnabled ? 'white' : 'black'}
        onValueChange={() => {
          setIsEnabled(prev => !prev);
          onClick();
        }}
        value={isEnabled}
      />
    </View>
  );
};

const SettingItemWithoutSwitch = ({
  name,
  icon,
  iconColor,
  backgroundIconColor,
  onClick,
  selectionName = ''
}) => {
  return (
    <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
      <View
        style={{
          backgroundColor: backgroundIconColor,
          padding: 8,
          borderRadius: 25,
          marginRight: 12
        }}>
        <Entypo name={icon} size={20} color={iconColor} />
      </View>
      <View style={{flex: 1}}>
        <Text style={{color: 'black'}}>{name}</Text>
      </View>
      <Text style={{color: 'black'}}>{selectionName}</Text>
      <TouchableOpacity
        onPress={onClick}
        style={{
          borderRadius: 8,
          backgroundColor: 'gray',
          padding: 8,
          marginLeft: 12
        }}>
        <Entypo name="chevron-right" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export {SettingItemWithSwitch, SettingItemWithoutSwitch};
