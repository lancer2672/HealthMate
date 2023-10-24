import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {Text, Surface} from 'react-native-paper';
import {LineChart} from 'react-native-chart-kit';
import {splitObj, today} from '../utils';
import {useTheme} from 'styled-components';

const screenWidth = Dimensions.get('window').width;
function getCurrentDate() {
  const date = new Date();
  return `${date.getDate()}/${date.getMonth() + 1}`;
}
export default function HistoryChart(props) {
  const theme = useTheme();
  console.log('HistoryChart', props);
  // Prop for selected day's data
  const [data, setData] = React.useState(null);
  // Prop for line chart's data
  const [chartData, setChartData] = React.useState({
    datasets: [{data: [0]}],
    labels: [getCurrentDate()],
  });

  React.useEffect(() => {
    if (props.chartData) {
      setChartData({
        ...splitObj(props.chartData),
        legend: ['Water intake', 'Goal'],
      });
    }
  }, [props.chartData]);

  const chartConfig = {
    backgroundColor: 'red',
    backgroundGradientFrom: 'gray',
    backgroundGradientTo: 'gray',
    fillShadowGradient: '#2176FF',
    fillShadowGradientOpacity: '1',
    color: (opacity = 1) => `rgba(33, 118, 255, ${opacity})`, // optional
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    propsForDots: {
      r: '5',
      strokeWidth: '3',
      stroke: '#FFFFFF',
    },
    propsForBackgroundLines: {
      strokeWidth: 0,
    },
    barPercentage: 0.5,
  };

  return (
    <LineChart
      data={chartData}
      width={screenWidth}
      height={300}
      chartConfig={chartConfig}
      style={{}}
    />
  );
}

const styles = StyleSheet.create({
  surface: {
    flex: 1,
    padding: 10,
    width: screenWidth,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
  },
  graph: {
    flex: 1,
    width: screenWidth,
  },
});
