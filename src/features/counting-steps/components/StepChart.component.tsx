import {useEffect, useRef, useState} from 'react';
import {Dimensions, ScrollView, View} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import {Rect, Svg, Text} from 'react-native-svg';
import {useSelector} from 'react-redux';
import {getStepsByMonth} from 'src/services/firebase/database/activity';
import {userSelector} from 'src/store/selectors';
import {useTheme} from 'styled-components';

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
  let [tooltipPos, setTooltipPos] = useState({
    x: 0,
    y: 0,
    visible: false,
    value: 0
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

      labels.push(`${i}`);
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

    let isSamePoint = tooltipPos.x === data.x && tooltipPos.y === data.y;

    // if clicked on the same point again toggle visibility
    // else,render tooltip to new position and update its value
    isSamePoint
      ? setTooltipPos(previousState => {
          return {
            ...previousState,
            value: data.value,
            visible: !previousState.visible
          };
        })
      : setTooltipPos({x: data.x, value: data.value, y: data.y, visible: true});
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
  }, [selectedDate?.getMonth()]);

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
          width={2000}
          decorator={() => {
            return tooltipPos.visible ? (
              <View>
                <Svg>
                  <Rect
                    x={tooltipPos.x - 15}
                    y={tooltipPos.y + 10}
                    width="40"
                    height="30"
                    fill="black"
                  />
                  <Text
                    x={tooltipPos.x + 5}
                    y={tooltipPos.y + 30}
                    fill="white"
                    fontSize="16"
                    fontWeight="bold"
                    textAnchor="middle">
                    {tooltipPos.value}
                  </Text>
                </Svg>
              </View>
            ) : null;
          }}
          onDataPointClick={onDataPointClick}
          height={300}
          style={{flex: 1}}
          chartConfig={chartConfig}
        />
      )}
    </ScrollView>
  );
}

const ToolTip = () => {
  return (
    <View>
      <Svg>
        <Rect x={80} y={110} width="40" height="30" fill="black" />
        <Text
          x={100}
          y={130}
          fill="white"
          fontSize="16"
          fontWeight="bold"
          textAnchor="middle">
          0.0
        </Text>
      </Svg>
    </View>
  );
};
export default StepChart;
