import {useEffect, useRef, useState} from 'react';
import {Dimensions, ScrollView, Text, View} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import {useSelector} from 'react-redux';
import {getHistoryCalorieByWeek} from 'src/services/firebase/database/calorie-history';
import {userSelector} from 'src/store/selectors';

import {useTheme} from 'styled-components';

const SCREEN_WIDTH = Dimensions.get('window').width;
function CalorieHistoryChart({selectedDate}) {
  const theme = useTheme();
  const {user} = useSelector(userSelector);
  useEffect(() => {
    if (user) {
      getHistoryCalorieByWeek({
        userId: user.uid,
        date: selectedDate
      })
        .then(history => {
          getDataChartFromHistory(history);
        })
        .catch(er => console.log('get history by date error', er));
    }
  }, [user, selectedDate]);
  const scrollRef = useRef(null);
  const [chartData, setChartData] = useState({
    labels: ['22/2'],
    datasets: [{data: [129]}]
  });

  const getDataChartFromHistory = history => {
    if (!history) setChartData(null);
    const labels = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday'
    ];
    const dataCalorieLeft = [0, 0, 0, 0, 0, 0, 0];
    const dataCalorieNeed = [0, 0, 0, 0, 0, 0, 0];

    for (const [timestamp, value] of Object.entries(history)) {
      const day = new Date(Number(timestamp)).getDay();
      dataCalorieLeft[day] = value?.calorieLeft;
      dataCalorieNeed[day] = value?.calorieNeed;
    }
    const chartStepData = {
      labels,
      datasets: [
        {
          data: dataCalorieLeft,
          color: (opacity = 1) => `rgba(244, 67, 54, ${opacity})`
        },
        {
          data: dataCalorieNeed,

          color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`
        },
        {data: [2000], withDots: false}
        //set default height: {data: [2000], withDots: false}
      ],
      legend: ['Calories Target', 'Calories Consumed']
    };

    console.log('getDataChartFromHistory', {
      history,
      chartStepData
    });
    setChartData(dataCalorieLeft.length === 0 ? null : chartStepData);
  };

  const chartConfig = {
    hideLegend: false,
    backgroundColor: '#fff', // white background
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    fillShadowGradient: '#4CAF50', // green shadow gradient
    fillShadowGradientOpacity: '1',
    color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`, // blue color
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // black label color
    propsForDots: {
      r: '5',
      strokeWidth: '3',
      stroke: 'gray' // white dot stroke
    },
    propsForBackgroundLines: {
      strokeWidth: 0
    },
    barPercentage: 0.5
  };

  return (
    <View style={{flex: 1}}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        ref={scrollRef}>
        {chartData == null ? (
          <View
            style={{
              height: 350,
              width: '100%',
              alignItems: 'center'
            }}>
            <Text style={{fontSize: 18, fontWeight: '500'}}>No data</Text>
          </View>
        ) : (
          <LineChart
            data={chartData}
            width={700}
            height={350}
            chartConfig={chartConfig}
          />
        )}
      </ScrollView>
    </View>
  );
}

export default CalorieHistoryChart;
