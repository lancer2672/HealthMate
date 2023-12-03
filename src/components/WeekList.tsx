import {FlatList, StyleSheet, TouchableOpacity, Text, View} from 'react-native';
import React, {FC, useState} from 'react';
import {useTheme} from 'styled-components';

const week = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WeekList = ({onItemClick}) => {
  const theme = useTheme();
  const [selectedIndex, setSelectedIndex] = useState(new Date().getDay());
  return (
    <View style={styles.container}>
      {week.map((item, index) => {
        return (
          <WeekItem
            key={`week${index}`}
            onClick={() => {
              setSelectedIndex(index);
              onItemClick(index);
            }}
            day={item}
            index={index}
            isSelected={selectedIndex === index}
          />
        );
      })}
    </View>
  );
};

const WeekItem: FC = ({day, index, onClick, isSelected = false}) => {
  const theme = useTheme();
  const currentDay = new Date().getDay();
  console.log('currentDay', currentDay);
  const isPast = index <= currentDay;

  const backgroundColor = isSelected ? theme.secondary : 'gray';
  const opacity = isPast ? 0.6 : 1;

  return (
    <View>
      <TouchableOpacity
        onPress={onClick}
        style={[
          styles.circleNumber,
          {
            backgroundColor,
            opacity,
            borderColor: isPast ? theme.secondary : 'gray'
          }
        ]}>
        <Text style={[styles.number]}>{day}</Text>
      </TouchableOpacity>
      <View style={styles.marker}></View>
    </View>
  );
};
export default WeekList;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8
  },
  marker: {},
  circleNumber: {
    width: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    backgroundColor: 'gray',
    height: 28,
    marginRight: 12,
    padding: 4
  },
  number: {
    color: 'white'
  }
});
