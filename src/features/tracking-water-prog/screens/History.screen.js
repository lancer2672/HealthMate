import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {Title} from 'react-native-paper';
import {CalendarList} from 'react-native-calendars';
import {today} from '../utils';
import DateData from '../components/DateData';
import {useSelector} from 'react-redux';

export default function WaterTrackingHistory() {
  const [marked, setMarked] = React.useState({});
  const {todayProgress} = useSelector(state => state.waterTracking);
  const [waterObject, setWaterObject] = React.useState({});
  const [selected, setSelected] = React.useState(null);

  // Currently breaks the app
  React.useEffect(() => {
    firebase
      .database()
      .ref('users/001/')
      .on('value', snapshot => {
        const data = snapshot.val();
        const prods = Object.values(data);
        const markedData = prods.reduce(
          (obj, item) => ({...obj, [item.date]: {selected: true}}),
          {},
        );
        const waterData = prods.reduce(
          (obj, item) => ({...obj, [item.date]: item.waterAmount}),
          {},
        );
        setMarked(markedData);
        setWaterObject(waterData);
      });
    const sessions = todayProgress.sessions;
    for (let session of todayProgress.sessions) {
      const date = new Date(session.time).toISOString().split('T')[0];
    }
  }, []);
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const db = firebase.database().ref('users/X3jnZPB4T5fNMmfB1Pw0FTZVX6t2');
  //     const snapshot = await db.once('value');
  //     const data = snapshot.val();

  //     let markedData = {};
  //     let waterData = {};

  //     for (let session of data.sessions) {
  //       const date = new Date(session.time).toISOString().split('T')[0];
  //       markedData[date] = { selected: true };

  //       if (!waterData[date]) {
  //         waterData[date] = 0;
  //       }
  //       waterData[date] += session.amount;
  //     }

  //     setMarked(markedData);
  //     setWaterObject(waterData);
  //   };

  //   fetchData();
  // }, []);
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
        <DateData date={selected} chartData={waterObject} />
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
