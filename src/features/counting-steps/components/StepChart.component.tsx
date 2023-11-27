import React, {memo, useEffect, useRef, useState} from 'react';
import {Dimensions, ScrollView, StyleSheet, View} from 'react-native';
import {Text, Surface} from 'react-native-paper';
import {LineChart} from 'react-native-chart-kit';
import {useTheme} from 'styled-components';
import {getStepsByMonth} from 'src/services/firebase/database/activity';
import {userSelector} from 'src/store/selectors';
import {useSelector} from 'react-redux';
import {getDateMonthLabel} from 'src/utils/chartDataHelper';

const SCREEN_WIDTH = Dimensions.get('window').width;

type StepData = {
  [key: string]: number
};

type StepChartProps = {};
function StepChart({selectedDate, setSelectedDate}) {
  const theme = useTheme();
  const {user} = useSelector(userSelector);
  const scrollRef = useRef<ScrollView>();
  const [chartData, setChartData] = useState({
    labels: ['22/2'],
    datasets: [{data: [129]}]
  });
  const getDataChartFromStepMonth = (stepMonthData: StepData[]) => {
    const map = new Map();
    stepMonthData.forEach(data => {
      const [timestamp, value] = Object.entries(data)[0];
      const date = new Date(Number(timestamp)).getDate();
      map.set(date, value);
    });

    const labels = [];
    const data = [];
    const currentDate = new Date().getDate();
    for (let i = 1; i <= currentDate; i++) {
      const value = map.get(i);

      data.push(value || 0);

      labels.push(`${i}/${selectedDate.getMonth() + 1}`);
    }
    const chartStepData = {
      labels,
      datasets: [{data: data}, {data: [2000], withDots: false}]
    };
    setChartData(data.length === 0 ? null : chartStepData);
  };

  const onDataPointClick = data => {
    console.log('onDataPointClick', data);
    // const l =vvvvvvvvvvvvvvvvvvvvvvvv
    const {x, y, index} = data;
    const date = chartData.labels[index].split('/')[0];
    console.log('chartData', date);

    setSelectedDate(prevDate => {
      const newDate = new Date(prevDate.getTime());
      newDate.setDate(Number(date));
      return newDate;
    });
    //scroll to the center
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        x: x - SCREEN_WIDTH / 2,
        y: 0,
        animated: true
      });
    }
    // {index: 1, value: 4189, dataset: {data:[4]}, x: 198, y: 16, …}
  };
  useEffect(() => {
    (async () => {
      const stepMonthData = await getStepsByMonth({
        userId: user.uid,
        date: selectedDate
      });
      getDataChartFromStepMonth(stepMonthData);
      console.log('useEffect', stepMonthData, selectedDate.getMonth());
    })();
  }, [selectedDate.getMonth()]);

  const chartConfig: any = {
    backgroundColor: theme.background,
    backgroundGradientFrom: theme.background,
    backgroundGradientTo: theme.background,
    fillShadowGradient: '#2176FF',
    fillShadowGradientOpacity: '1',
    color: (opacity = 1) => `rgba(33, 118, 255, ${opacity})`, // optional
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    propsForDots: {
      r: '5',
      strokeWidth: '3',
      stroke: '#FFFFFF'
    },
    propsForBackgroundLines: {
      strokeWidth: 0
    },
    barPercentage: 0.5
  };
  return (
    <ScrollView
      style={{backgroundColor: 'tomato'}}
      horizontal
      showsHorizontalScrollIndicator={false}
      ref={scrollRef}
      contentOffset={{x: 10000, y: 0}}>
      {chartData == null ? (
        <View style={{height: 300, width: '100%'}}></View>
      ) : (
        <LineChart
          data={chartData}
          width={600}
          onDataPointClick={onDataPointClick}
          height={300}
          style={{flex: 1}}
          chartConfig={chartConfig}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  surface: {
    flex: 1,
    padding: 10,
    width: SCREEN_WIDTH,
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 1
  },
  graph: {
    flex: 1,
    width: SCREEN_WIDTH
  }
});

export default StepChart;
