import {FlatList, StyleSheet, TouchableOpacity, Text, View} from 'react-native';
import React, {FC, useEffect, useMemo, useState} from 'react';
import {useTheme} from 'styled-components';
import {getSpecificDateTimeStamp} from 'src/utils/dateTimeHelper';
import {getHistoryByDate} from 'src/services/firebase/firestore/exercise';
import {useSelector} from 'react-redux';
import {userSelector} from 'src/store/selectors';

const week = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WeekList = ({onItemClick}) => {
  const theme = useTheme();
  const [selectedIndex, setSelectedIndex] = useState(new Date().getDay());
  const handleClick = index => {
    setSelectedIndex(index);
    onItemClick(index);
  };

  return (
    <View style={styles.container}>
      {week.map((item, index) => {
        return (
          <WeekItem
            key={`week${index}`}
            onClick={() => {
              handleClick(index);
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
  const {user} = useSelector(userSelector);
  const [isAchievedGoal, setIsAchieveGoal] = useState(false);
  const currentDay = new Date().getDay();
  console.log('currentDay', currentDay);
  const isPast = index <= currentDay;

  const getBackgroundColor = () => {
    console.log('isAchievedGoal', isPast, isAchievedGoal);
    if (!isPast) return 'gray';
    return isAchievedGoal ? theme.success : theme.failed;
  };
  const backgroundColor = useMemo(getBackgroundColor, [
    isSelected,
    isPast,
    isAchievedGoal
  ]);
  useEffect(() => {
    (async () => {
      const now = new Date();
      const startOfWeek = now.getDate() - now.getDay();
      const dayOfWeek = new Date(
        now.getFullYear(),
        now.getMonth(),
        startOfWeek + index
      );
      const timestamp = getSpecificDateTimeStamp(dayOfWeek);
      const data = await getHistoryByDate({
        userId: user.uid,
        dateKey: timestamp
      });

      if (data) {
        setIsAchieveGoal(true);
      }
    })();
  }, [isSelected]);
  return (
    <View>
      <TouchableOpacity
        onPress={onClick}
        style={[
          styles.circleNumber,
          {
            backgroundColor: backgroundColor,
            opacity: isSelected ? 1 : 0.5,
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
