import React, {useState, useEffect, useCallback, useMemo} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';
import HistoryChart from '../components/HistoryChart';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import {useSelector} from 'react-redux';
import {
  getDrinkProgressByDate,
  getDrinkProgressByMonth
} from '../../../services/firebase/firestore/drinkProgress';
import MonthYearPicker from '../../../components/MonthYearPicker';
import {useTheme} from 'styled-components';
import {date} from 'yup';
export default function WaterTrackingHistory() {
  const theme = useTheme();
  const {user} = useSelector(state => state.user);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [hasChartData, setHasChartData] = useState(false);
  const [chartData, setChartData] = useState({
    datasets: [{data: [0]}],
    labels: [0]
  });
  const [streaks, setStreaks] = useState(0);
  const [mediumMonthAmount, setMediumMonthAmout] = useState(0);
  const [isLoading, setIsLoading] = useState(0);

  const handleLongestStreak = listHistory => {
    const mappedHistoryData = listHistory.map(data => {
      console.log('data', data);
      return {
        ...data,
        date: new Date(data.date._seconds * 1000).getDate()
      };
    });

    //first date
    let initValue = 1,
      streakCount = 0,
      max = 0;
    for (let i = 0; i < mappedHistoryData.length - 1; i++) {
      const date = mappedHistoryData[i].date;
      if (
        date == initValue &&
        mappedHistoryData[i].goal <= mappedHistoryData[i].totalAmount
      ) {
        streakCount++;
      } else if (
        mappedHistoryData[i].goal <= mappedHistoryData[i].totalAmount
      ) {
        streakCount = 1;
        initValue = date;
      } else {
        streakCount = 0;
        initValue = date;
      }
      initValue++;
      max = max < streakCount ? streakCount : max;
    }
    setStreaks(max);
  };

  useEffect(() => {
    setIsLoading(true);
    getDrinkProgressByMonth({
      userId: user.uid,
      year: selectedYear,
      month: selectedMonth + 1
    })
      .then(data => {
        console.log('Dataaaaa', data);

        setHasChartData(data.length > 0);

        handleData(data);
      })
      .catch(er => console.log(er))
      .finally(() => {
        setIsLoading(false);
      });
  }, [selectedMonth, selectedYear]);

  const handleData = data => {
    if (!data || data.length === 0) return;
    let totalMonthAmount = 0;

    const mapData = new Map();
    data.forEach(d => {
      let date = d.date.toDate().getDate();
      totalMonthAmount += d.totalAmount;
      mapData.set(date, {
        totalAmount: d.totalAmount,
        goal: d.goal
      });
    });
    createChartData(mapData);
    handleLongestStreak(data);
    setMediumMonthAmout(
      data.length === 0 ? 0 : Math.floor(totalMonthAmount / data.length)
    );
  };

  const createChartData = mapData => {
    const labels = [],
      goals = [],
      total = [];
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    if (selectedMonth === currentMonth) {
      const maxDay = currentDate.getDate();
      lastDayOfMonth.setDate(maxDay);
    }

    const startDate = mapData.keys().next().value;
    console.log('startDate', startDate);
    for (let i = startDate; i <= lastDayOfMonth.getDate(); i++) {
      const value = mapData.get(i);

      goals.push(value?.goal || 0);
      total.push(value?.totalAmount || 0);
      labels.push(i);
    }
    setChartData({
      labels,
      datasets: [
        {data: goals, color: (opacity = 1) => `rgba(168, 62, 33, ${opacity})`},
        {data: total},
        {data: [500], withDots: false}
      ],
      legend: ['Goal', 'Water intake']
    });
  };
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
            color={theme.primary}></FontAwesome6>
          <Text style={styles.label}>Daily intake</Text>
          <Text style={styles.text}>{mediumMonthAmount} ml</Text>
        </View>
        <View style={styles.subContent}>
          <FontAwesome6
            name="fire-flame-curved"
            size={40}
            color={'tomato'}></FontAwesome6>
          <Text style={styles.label}>Longest streak</Text>
          <Text style={styles.text}>{streaks} day</Text>
        </View>
      </View>
      <View
        style={{
          flex: 1,
          width: '100%'
        }}>
        {hasChartData ? (
          <HistoryChart chartData={chartData} />
        ) : (
          <Text style={styles.nodata}>No data</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    alignItems: 'center',
    backgroundColor: theme.background,
    justifyContent: 'space-between'
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
    elevation: 2
  },
  calendar: {},
  nodata: {
    fontSize: 32,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  heading: {
    fontSize: 40,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  text: {
    fontSize: 28,
    fontWeight: 'bold'
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  content: {
    flex: 1,
    marginHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  buttons: {
    flex: 0,
    flexDirection: 'row',
    width: Dimensions.get('window').width,
    justifyContent: 'space-evenly'
  }
});
