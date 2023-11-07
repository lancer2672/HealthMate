import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  View
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CircularProgress from 'react-native-circular-progress-indicator';
import {useTheme} from 'styled-components';
import {LineChart} from 'react-native-chart-kit';

import Dialog from 'src/components/Dialog';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {DEFAULT_STEP_GOAL} from 'src/constants';
import {useDispatch, useSelector} from 'react-redux';
import {activitySelector, userSelector} from 'src/store/selectors';
import {updateUserActivityAction} from 'src/store/reducer/thunks/activityActions';
import {useAppDispatch, useAppSelector} from 'src/store/hooks';
import {getStepsByMonth} from 'src/services/firebase/database/activity';
import StepChart from '../components/StepChart.component';
import Header from '../components/Header.component';
import moment from 'moment';
import enableTrackingUserActivities, {
  getPeriodCalories,
  getPeriodDistance,
  getPeriodMoveMins,
  getPeriodSteps
} from 'src/config/trackingActivities';
import {getEndDayISO, getStartDayISO} from 'src/utils/dateTimeHelper';
import DatePicker from 'react-native-date-picker';

const StepCounter = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const {todaySteps, todayCalories, todayDistance, stepTarget} =
    useSelector(activitySelector);
  const {user} = useAppSelector(userSelector);
  const [monthSteps, setMonthSteps] = useState(new Date().getMonth());
  console.log('todayCalories', todayCalories);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [distance, setDistance] = useState(0);
  const [steps, setSteps] = useState(0);
  const [calories, setCalories] = useState(0);
  const [moveMinutes, setMoveMinutes] = useState(0);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const setTarget = async (target: number) => {
    if (target >= 0) {
      dispatch(
        updateUserActivityAction({
          userId: user.uid,
          field: 'stepTarget',
          value: target
        })
      );
      await AsyncStorage.setItem(DEFAULT_STEP_GOAL, JSON.stringify(target));
    }
  };

  useEffect(() => {
    (async () => {
      await getStepsByMonth({userId: user.uid, month: new Date().getMonth()});
    })();
  }, [monthSteps]);
  useEffect(() => {
    (async () => {
      if (await enableTrackingUserActivities()) {
        const startTime = getStartDayISO(selectedDate);
        const endTime = getEndDayISO(selectedDate);

        console.log('selectdDate', todaySteps);
        if (
          selectedDate.setHours(0, 0, 0, 0) == new Date().setHours(0, 0, 0, 0)
        ) {
          setSteps(todaySteps);
        } else {
          const stepRes = await getPeriodSteps(startTime, endTime);
          setSteps(stepRes || 0);
        }

        const calorieRes = await getPeriodCalories(startTime, endTime);
        setCalories(Number(calorieRes || 0).toFixed(2));

        const distanceRes = await getPeriodDistance(startTime, endTime);
        setDistance(Number(distanceRes || 0).toFixed(2));

        const moveRes = await getPeriodMoveMins(startTime, endTime);
        setMoveMinutes(moveRes || 0);
      }
    })();
  }, [selectedDate, todaySteps]);

  return (
    <View style={[styles.container, {backgroundColor: theme.background}]}>
      <Header
        openDatePicker={() => setShowDatePicker(true)}
        selectedDate={selectedDate}></Header>
      <AnimatedCircularProgress
        size={220}
        width={10}
        fill={stepTarget === 0 ? 100 : (steps / stepTarget) * 100}
        tintColor="#00e0ff"
        backgroundColor="#3d5875">
        {fill => (
          <View style={{alignItems: 'center'}}>
            <Text style={styles.step}>{steps}</Text>
            <Text style={{color: 'white', fontSize: 18}}>
              {stepTarget === 0 ? 'steps' : `of ${stepTarget} steps`}
            </Text>
          </View>
        )}
      </AnimatedCircularProgress>

      <View style={styles.icons}>
        <View style={{alignItems: 'center'}}>
          <Ionicons name={'timer-outline'} size={38} color={'white'}></Ionicons>
          <Text style={styles.textIcon}>${moveMinutes} min</Text>
        </View>
        <View style={{alignItems: 'center'}}>
          <SimpleLineIcons
            name={'energy'}
            size={38}
            color={'white'}></SimpleLineIcons>
          <Text style={styles.textIcon}>{calories} kcal</Text>
        </View>
        <View style={{alignItems: 'center'}}>
          <Ionicons
            name={'footsteps-outline'}
            size={38}
            color={'white'}></Ionicons>
          <Text style={styles.textIcon}>{distance} m</Text>
        </View>
      </View>
      <View style={{height: 300, backgroundColor: 'tomato'}}>
        <StepChart selectedDate={selectedDate}></StepChart>
      </View>
      <Dialog
        onClick={setTarget}
        title={'Set target'}
        buttonContent={'Done'}
        onClose={() => setModalVisible(false)}
        isVisible={isModalVisible}></Dialog>

      <DatePicker
        mode="date"
        date={selectedDate}
        modal
        open={showDatePicker}
        onCancel={() => {
          setShowDatePicker(false);
        }}
        onConfirm={date => {
          console.log('Date', date);
          setSelectedDate(date);
          setShowDatePicker(false);
        }}
      />
    </View>
  );
};

export default StepCounter;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  step: {
    fontSize: 60,
    color: 'white'
  },
  icons: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  textIcon: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold'
  }
});
