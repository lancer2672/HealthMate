import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axiosClient from 'src/api/axiosClient';
import exerciseApi from 'src/api/exerciseApi';
import {EXERCISE_BASE_URL} from 'src/constants';

const weekdate = [
  {label: 'Sunday', value: 0},
  {label: 'Monday', value: 1},
  {label: 'Tuesday', value: 2},
  {label: 'Wednesday', value: 3},
  {label: 'Thursday', value: 4},
  {label: 'Friday', value: 5},
  {label: 'Saturday', value: 6}
];

const WeekDateDropDown = ({onItemSelected}) => {
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  const onBodyPartSelected = async item => {
    setValue(item.value);
    onItemSelected(item.value);
    setIsFocus(false);
  };
  return (
    <View style={styles.container}>
      <Dropdown
        style={[styles.dropdown]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        // inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={weekdate}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={'Select day'}
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={onBodyPartSelected}
        // renderLeftIcon={() => (
        //   <Ionicons
        //     style={styles.icon}
        //     color={'black'}
        //     name="body-outline"
        //     size={20}
        //   />
        // )}
      />
    </View>
  );
};

export default WeekDateDropDown;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    padding: 4,
    flex: 1
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    backgroundColor: 'black',
    paddingHorizontal: 8
  },
  icon: {
    marginRight: 5
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14
  },
  placeholderStyle: {
    fontSize: 16,
    color: 'white'
  },
  selectedTextStyle: {
    fontSize: 16,
    color: 'white'
  },
  iconStyle: {
    width: 20,
    height: 20
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16
  }
});
