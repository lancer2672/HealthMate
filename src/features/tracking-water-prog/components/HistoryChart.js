import {Dimensions, ScrollView, StyleSheet} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import {useTheme} from 'styled-components';

const SCREEN_WIDTH = Dimensions.get('window').width;
function getCurrentDate() {
  const date = new Date();
  return `${date.getDate()}/${date.getMonth() + 1}`;
}
function HistoryChart({chartData}) {
  const theme = useTheme();

  const chartConfig = {
    backgroundColor: 'red',
    backgroundGradientFrom: theme.background,
    backgroundGradientTo: theme.background,
    fillShadowGradient: '#2176FF',
    fillShadowGradientOpacity: '1',
    color: (opacity = 1) => `rgba(33, 118, 255, ${opacity})`, // optional
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    propsForDots: {
      r: '4',
      strokeWidth: '1',
      stroke: '#FFFFFF'
    },
    propsForBackgroundLines: {
      strokeWidth: 0
    },
    barPercentage: 0.5
  };
  return (
    <ScrollView horizontal contentOffset={{x: 200, y: 0}}>
      <LineChart
        data={chartData}
        width={2000}
        height={300}
        style={{flex: 1}}
        chartConfig={chartConfig}
      />
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

export default HistoryChart;
