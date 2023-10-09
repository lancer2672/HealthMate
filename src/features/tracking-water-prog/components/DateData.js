import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {Text, Surface} from 'react-native-paper';
// import * as firebase from "firebase";
import {LineChart} from 'react-native-chart-kit';
import {splitObj, today} from '../utils';

const screenWidth = Dimensions.get('window').width;
function getCurrentDate() {
  const date = new Date();
  return `${date.getDate()}/${date.getMonth() + 1}`;
}
export default function DateData(props) {
  console.log('DateData', props);
  // Prop for selected day's data
  const [data, setData] = React.useState(null);
  // Prop for line chart's data
  const [chartData, setChartData] = React.useState({
    datasets: [{data: [0]}],
    labels: [getCurrentDate()],
  });
  console.log('chartData', chartData);

  React.useEffect(() => {
    if (props.chartData) {
      setChartData({
        ...splitObj(props.chartData),
        legend: ['Lượng nước', 'Mục tiêu'],
      });
    }
  }, [props.chartData]);

  const chartConfig = {
    backgroundColor: '#131A26',
    backgroundGradientFrom: '#131A26',
    backgroundGradientTo: '#131A26',
    fillShadowGradient: '#2176FF',
    fillShadowGradientOpacity: '0',
    color: (opacity = 1) => `rgba(33, 118, 255, ${opacity})`, // optional
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    propsForDots: {
      r: '5',
      strokeWidth: '3',
      stroke: '#FFFFFF',
    },
    barPercentage: 0.5,
  };

  return (
    <View>
      <Surface style={styles.surface}>
        {data !== null && <Text>Water intake: {data} ml</Text>}
        {data === null && <Text>Select a valid date</Text>}
      </Surface>
      <LineChart
        data={chartData}
        width={screenWidth}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    </View>
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
