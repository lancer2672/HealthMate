import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

const Calendar = ({selectedMonth, selectedYear, onDatePress}) => {
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const renderCalendar = () => {
    const calendar = [];
    let dayCounter = 1;

    for (let i = 0; i < 5; i++) {
      const week = [];

      for (let j = 0; j < 7; j++) {
        if ((i === 0 && j < firstDayOfMonth) || dayCounter > daysInMonth) {
          week.push(null);
        } else {
          week.push(dayCounter);
          dayCounter++;
        }
      }

      calendar.push(week);
    }

    return calendar;
  };

  const calendarData = renderCalendar();

  return (
    <View style={{width: '100%', padding: 10}}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        {dayNames.map((day, index) => (
          <View
            key={index}
            style={[
              styles.dayContainer,
              {
                backgroundColor: 'transparent'
              }
            ]}>
            <Text>{day}</Text>
          </View>
        ))}
      </View>
      <View style={styles.container}>
        {calendarData.map((week, weekIndex) => (
          <View key={weekIndex} style={styles.weekContainer}>
            {week.map((day, dayIndex) => (
              <TouchableOpacity
                key={dayIndex}
                style={[
                  styles.dayContainer,
                  day === null ? styles.nullDay : null
                ]}
                onPress={() => onDatePress(day)}
                disabled={!day}>
                <Text style={styles.dayText}>{day}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10
  },
  weekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  dayContainer: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#e0e0e0'
  },
  nullDay: {
    backgroundColor: 'transparent'
  },
  dayText: {
    color: 'black',
    fontSize: 16
  }
});

export default Calendar;
