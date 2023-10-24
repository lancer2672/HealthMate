import React, {useState, useEffect} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import HistoryChart from '../components/HistoryChart';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import {useSelector} from 'react-redux';
import {
  getDrinkProgressByDate,
  getDrinkProgressByMonth,
} from '../../../services/firebase/firestore/drinkProgress';
import MonthYearPicker from '../../../components/MonthYearPicker';
import {useTheme} from 'styled-components';
export default function WaterTrackingHistory() {
  const theme = useTheme();
  const {user} = useSelector(state => state.user);
  const [selected, setSelected] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [chartData, setChartData] = useState([]);
  const [streaks, setStreaks] = useState(0);
  const [mediumMonthAmount, setMediumMonthAmout] = useState(0);
  const [isLoading, setIsLoading] = useState(0);

  const streakCount = listHistory => {
    let day = new Date().getDate() - 1;
    let month = new Date().getMonth();
    let year = new Date().getFullYear();

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
    setIsLoading(true);
    getDrinkProgressByMonth({
      userId: user.uid,
      year: selectedYear,
      month: selectedMonth + 1,
    })
      .then(data => {
        console.log('data drink progress', data);
        let totalMonthAmount = 0;
        const mappedData = data.map(history => {
          totalMonthAmount += history.totalAmount;
          const date = history.date.toDate();
          return {
            [`${date.getDate()}/${date.getMonth() + 1}`]: history.totalAmount,
            goal: history.goal,
          };
        });
        streakCount(data);

        setMediumMonthAmout(
          data.length === 0 ? 0 : Math.floor(totalMonthAmount / data.length),
        );

        setChartData(mappedData);
      })
      .catch(er => console.log(er))
      .finally(() => {
        setIsLoading(false);
      });
  }, [selectedMonth, selectedYear]);
  console.log('ChrTDaat', chartData);
  return (
    <View style={styles.container(theme)}>
      <View>
        <TouchableOpacity onPress={null}></TouchableOpacity>
        <Text style={styles.heading}>Your Progress</Text>
        <MonthYearPicker
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          setSelectedMonth={setSelectedMonth}></MonthYearPicker>
      </View>
      <View style={styles.content}>
        <View style={styles.subContent}>
          <FontAwesome6
            name="droplet"
            size={40}
            color={theme.waterTracking.primary}></FontAwesome6>
          <Text style={styles.label}>Daily intake</Text>
          <Text style={styles.text}>{mediumMonthAmount} ml</Text>
        </View>
        <View style={styles.subContent}>
          <FontAwesome6
            name="fire-flame-curved"
            size={40}
            color={'tomato'}></FontAwesome6>
          <Text style={styles.label}>Current streak</Text>
          <Text style={styles.text}>{streaks} day</Text>
        </View>
      </View>
      {chartData.length === 0 ? (
        <View
          style={{
            flex: 1,
            width: '100%',
          }}></View>
      ) : (
        <HistoryChart isLoading={isLoading} chartData={chartData} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    alignItems: 'center',
    backgroundColor: theme.waterTracking.background,
    justifyContent: 'space-between',
  }),
  subContent: {
    flex: 1,
    backgroundColor: 'white',
    margin: 12,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  calendar: {},
  heading: {
    fontSize: 40,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  text: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    marginHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttons: {
    flex: 0,
    flexDirection: 'row',
    width: Dimensions.get('window').width,
    justifyContent: 'space-evenly',
  },
});
