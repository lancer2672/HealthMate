import {useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import MonthYearPicker from '../../../components/MonthYearPicker';
import Calendar from '../../meal/components/Calendar.component';

export default function MealCalendar({navigation}) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const colors = [
    '#8B0000',
    '#FF8C00',
    '#FFFF00',
    '#FF69B4',
    '#ADD8E6',
    '#008000'
  ];

  const onDatePress = day => {
    console.log('Day pressed:', day);
    navigation.navigate('TodayMealDate', {
      data: {
        day: day,
        month: selectedDate.getMonth(),
        year: selectedDate.getFullYear()
      }
    });
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        flexDirection: 'column',
        padding: 10
      }}>
      <View style={styles.container}>
        <View
          style={{
            backgroundColor: '#e0e0e0',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingLeft: 10
            // paddingRight: 10
          }}>
          <Text style={styles.tittle}>Food Logging Calendar</Text>
        </View>
        <View style={styles.calendarContainer}>
          <MonthYearPicker
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            textColor="black"
          />
          <Calendar
            selectedMonth={selectedDate.getMonth()}
            selectedYear={selectedDate.getFullYear()}
            onDatePress={onDatePress}
          />
          <View
            style={{
              flexDirection: 'row',
              gap: 5
            }}>
            {colors.map((color, index) => (
              <View
                key={index}
                style={[styles.box, {backgroundColor: color}]}></View>
            ))}
          </View>
        </View>
        <View style={styles.summaryContainer}>
          <View
            style={[
              styles.dayContainer,
              {
                borderRightWidth: 1,
                borderColor: 'gray'
              }
            ]}>
            <Text style={styles.text}>Day missed</Text>
            <Text style={styles.text}>30 days</Text>
          </View>
          <View style={styles.dayContainer}>
            <Text style={styles.text}>%Days of green</Text>
            <Text style={styles.text}>0%</Text>
          </View>
        </View>
      </View>
      <View
        style={{
          alignItems: 'center',
          marginBottom: 25
        }}>
        <Text
          style={{
            fontSize: 14
          }}>
          Tap on any date on the calendar to review or add foods.
        </Text>
      </View>
      <View style={styles.container}>
        <View
          style={{
            backgroundColor: '#e0e0e0',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingLeft: 10
            // paddingRight: 10
          }}>
          <Text style={styles.tittle}>Food Logging History</Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            padding: 20,
            justifyContent: 'space-between',
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: 'gray'
          }}>
          <Text style={styles.text}>Interval</Text>
          <Text style={styles.text}>Last 3 months</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            padding: 20,
            justifyContent: 'space-between'
            // borderTopWidth: 1,
            // borderBottomWidth: 1,
            // borderColor: 'gray'
          }}>
          <Text style={styles.text}>Total days</Text>
          <Text style={styles.text}>30 days</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'gray'
  },
  tittle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    padding: 10
  },
  calendarContainer: {
    padding: 10,
    flexDirection: 'column',
    alignItems: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'gray'
  },
  box: {
    width: 15,
    height: 15
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  dayContainer: {
    padding: 10,
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    color: 'black',
    fontSize: 16
  }
});
