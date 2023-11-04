import React, {memo, useEffect, useState} from 'react';
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
function StepChart() {
  const theme = useTheme();
  const {user} = useSelector(userSelector);

  const [data, setData] = useState(null);
  const [monthSteps, setMonthSteps] = useState(new Date().getMonth());
  const [chartData, setChartData] = useState({
    labels: ['22/2'],
    datasets: [{data: [129]}]
  });

  const getDataChartFromStepMonth = (stepMonthData: StepData[]) => {
    const labels = [];
    const data = [];

    console.log('stepMonthData', stepMonthData);
    stepMonthData.forEach((item, index) => {
      // item = {key : value}
      console.log('item', item);
      for (let [key, value] of Object.entries(item)) {
        const label = getDateMonthLabel(key);

        labels.push(label);
        data.push(value);
      }
    });
    const chartStepData = {
      labels,
      datasets: [{data: data}]
    };
    console.log('chartStepData', chartStepData);
    setChartData(chartStepData);
  };
  useEffect(() => {
    (async () => {
      const stepMonthData = await getStepsByMonth({
        userId: user.uid,
        month: new Date().getMonth()
      });
      getDataChartFromStepMonth(stepMonthData);
    })();
  }, [monthSteps]);
  const chartConfig: any = {
    backgroundColor: 'red',
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
      contentOffset={{x: 10000, y: 0}}>
      {chartData && (
        <LineChart
          data={chartData}
          width={600}
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
