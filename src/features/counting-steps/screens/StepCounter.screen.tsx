import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CircularProgress from 'react-native-circular-progress-indicator';
import {useTheme} from 'styled-components';
import {LineChart} from 'react-native-chart-kit';

import useHealthData from '../hooks/useHealthData';
import Dialog from '../../../components/Dialog';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {DEFAULT_STEP} from '../../../constants';
const StepCounter = () => {
  const theme = useTheme();
  const {steps, flights, distance} = useHealthData(new Date());
  console.log(steps, flights, distance);
  const [stepTarget, setStepTarget] = useState(100);
  const [isModalVisible, setModalVisible] = useState(false);
  const ref = useRef<any>();
  const setTarget = async (target: number) => {
    if (target >= 0) {
      await AsyncStorage.setItem(DEFAULT_STEP, JSON.stringify(target));
      setStepTarget(target);
    }
  };
  useEffect(() => {
    (async () => {
      const target = await AsyncStorage.getItem(DEFAULT_STEP);
      if (target) {
        setStepTarget(JSON.parse(target));
      }
    })();
  }, []);
  return (
    <View style={[styles.container, {backgroundColor: theme.background}]}>
      <TouchableOpacity
        style={{paddingHorizontal: 4, alignSelf: 'flex-end', marginRight: 24}}
        onPress={() => setModalVisible(true)}>
        <MaterialCommunityIcons name="shoe-sneaker" size={30} color="white" />
      </TouchableOpacity>
      <AnimatedCircularProgress
        size={220}
        width={10}
        fill={stepTarget === 0 ? 100 : (50 / stepTarget) * 100}
        tintColor="#00e0ff"
        backgroundColor="#3d5875">
        {fill => (
          <View style={{alignItems: 'center'}}>
            <Text style={styles.step}>{steps}</Text>
            {stepTarget !== 0 && (
              <Text style={{color: 'white', fontSize: 16}}>
                of {stepTarget} steps
              </Text>
            )}
          </View>
        )}
      </AnimatedCircularProgress>

      <View style={styles.icons}>
        <View>
          <Ionicons name={'timer-outline'} size={38} color={'white'}></Ionicons>
          <Text>#time min</Text>
        </View>
        <SimpleLineIcons
          name={'energy'}
          size={38}
          color={'white'}></SimpleLineIcons>
      </View>
      <View style={{height: 200}}>
        <ScrollView style={{}} contentOffset={{x: 10000, y: 0}} horizontal>
          <LineChart
            data={{
              labels: [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
              ],
              datasets: [
                {
                  data: [
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                  ],
                },
              ],
            }}
            width={900} // from react-native
            height={220}
            yAxisLabel="$"
            yAxisSuffix="k"
            yAxisInterval={1} // optional, defaults to 1
            chartConfig={{
              backgroundColor: 'red',
              backgroundGradientFrom: theme.background,
              backgroundGradientTo: theme.background,
              decimalPlaces: 2, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '4',
                strokeWidth: '2',
                stroke: theme.accent,
              },
              propsForBackgroundLines: {
                strokeWidth: 0,
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </ScrollView>
      </View>
      <Dialog
        onClick={setTarget}
        title={'Set target'}
        buttonContent={'Done'}
        onClose={() => setModalVisible(false)}
        isVisible={isModalVisible}></Dialog>
    </View>
  );
};

export default StepCounter;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  step: {
    fontSize: 60,
    color: 'white',
  },
  icons: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});
