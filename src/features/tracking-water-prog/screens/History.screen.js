import React, {useState, useEffect} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {Title} from 'react-native-paper';
import {CalendarList} from 'react-native-calendars';
import {today} from '../utils';
import DateData from '../components/DateData';
import firestore from '@react-native-firebase/firestore';

import {useSelector} from 'react-redux';
import {
  getHistoryBySelectedDate,
  getHistoryByMonth,
} from '../../../services/firebase/firestore/drinkTracking';
export default function WaterTrackingHistory() {
  const [marked, setMarked] = useState({});
  const {user} = useSelector(state => state.user);
  const {todayProgress} = useSelector(state => state.waterTracking);
  const [waterObject, setWaterObject] = useState({});
  const [selected, setSelected] = useState(null);
  const [historyList, setHistoryList] = useState();
  const [streaks, setStreaks] = useState(0);
  // Currently breaks the app
  const streakCount = listHistory => {
    let day = new Date().getDate() - 1; // Ngày trong tháng (từ 1 đến 31)
    let month = new Date().getMonth(); // Tháng trong năm (từ 0 đến 11, nên cần cộng thêm 1)
    let year = new Date().getFullYear(); // Năm

    // /1000 to convert mil -> second unit
    let timestamp = new Date(year, month, day).getTime() / 1000;
    let streakCount = 0;
    // today is not count (listHistory contain today drink progress)
    for (let i = listHistory.length - 2; i >= 0; i--) {
      if (
        listHistory[i].date._seconds == timestamp &&
        isGoalAchieved(listHistory[i].goal, listHistory[i].sessions)
      ) {
        streakCount++;
        timestamp = listHistory[i].date;
      }
    }
    console.log('streaks', streakCount);
    setStreaks(streakCount);
  };
  const isGoalAchieved = (goal, sessions) => {
    const totalAmount = sessions.reduce((ac, sess) => {
      return ac + sess.amount;
    }, 0);
    return totalAmount >= goal;
  };
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    getHistoryByMonth({
      userId: user.uid,
      year: currentYear,
      month: currentMonth,
    })
      .then(data => {
        console.log('data', data);
        const mappedData = data.map(history => {
          const totalValue = history.sessions.reduce((ac, session, i) => {
            return ac + session.amount;
          }, 0);

          const date = history.date.toDate();
          return {
            [`${date.getDate()}/${date.getMonth() + 1}`]: totalValue,
            goal: history.goal,
          };
        });
        streakCount(data);
        console.log('mappedData', mappedData);
        setHistoryList(mappedData);
      })
      .catch(er => console.log(er));
  }, []);
  return (
    <View style={styles.container}>
      <Title>Water intake history</Title>
      <View style={styles.calendar}>
        <CalendarList
          theme={{
            calendarBackground: '#131A26',
            textSectionTitleColor: '#ffffff',
            selectedDayTextColor: '#ffffff',
            selectedDayBackgroundColor: '#2176FF',
            dayTextColor: '#ffffff',
            monthTextColor: '#ffffff',
            textMonthFontWeight: 'bold',
          }}
          firstDay={1}
          horizontal={true}
          pagingEnabled={true}
          onDayPress={day => {
            console.log('day, water object', day, waterObject);
            if (!waterObject.hasOwnProperty(day['dateString'])) {
              setSelected(null);
            } else {
              setSelected(day['dateString']);
            }
          }}
          markedDates={{
            ...marked,
            [today()]: {selected: true, selectedColor: '#81c5fe'},
          }}
        />
      </View>
      <View style={styles.content}>
        <DateData date={selected} chartData={historyList} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 20,
    alignItems: 'center',
  },
  calendar: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
  buttons: {
    flex: 0,
    flexDirection: 'row',
    width: Dimensions.get('window').width,
    justifyContent: 'space-evenly',
  },
});
