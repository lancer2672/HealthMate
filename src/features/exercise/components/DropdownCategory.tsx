import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axiosClient from 'src/api/axiosClient';
import exerciseApi from 'src/api/exerciseApi';
import {EXERCISE_BASE_URL} from 'src/constants';

const DropDownCategory = ({setExercise}) => {
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [bodyPartList, setBodyPartList] = useState([]);

  const getListBodyPart = async () => {
    const data = await exerciseApi.getListBodyPart();
    const list = data.map(item => {
      return {
        label: item,
        value: item
      };
    });
    setBodyPartList(list);
  };
  useEffect(() => {
    getListBodyPart();
  }, []);

  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text style={[styles.label, isFocus && {color: 'black'}]}>
          Body Part
        </Text>
      );
    }
    return null;
  };

  const onBodyPartSelected = async item => {
    setValue(item.value);
    setIsFocus(false);
    const data = await exerciseApi.getExerciseByBodyPart(item.value);
    setExercise(data);
  };
  return (
    <View style={styles.container}>
      {renderLabel()}
      <Dropdown
        style={[styles.dropdown, isFocus && {borderColor: 'blue'}]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={bodyPartList}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? 'Body part' : '...'}
        searchPlaceholder="Search..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={onBodyPartSelected}
        renderLeftIcon={() => (
          <Ionicons
            style={styles.icon}
            color={'black'}
            name="body-outline"
            size={20}
          />
        )}
      />
    </View>
  );
};

export default DropDownCategory;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    backgroundColor: 'white',
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
    fontSize: 16
  },
  selectedTextStyle: {
    fontSize: 16
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
