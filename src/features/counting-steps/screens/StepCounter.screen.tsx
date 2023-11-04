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
import {DEFAULT_STEP} from 'src/constants';
import {useDispatch, useSelector} from 'react-redux';
import {activitySelector, userSelector} from 'src/store/selectors';
import {setStepTargetAction} from 'src/store/reducer/thunks/activityActions';
import {useAppDispatch, useAppSelector} from 'src/store/hooks';
import {getStepsByMonth} from 'src/services/firebase/database/activity';
import StepChart from '../components/StepChart.component';

const StepCounter = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const {dailySteps, stepTarget} = useSelector(activitySelector);
  const {user} = useAppSelector(userSelector);
  const [monthSteps, setMonthSteps] = useState(new Date().getMonth());
  console.log('dailySteps', dailySteps);
  const [isModalVisible, setModalVisible] = useState(false);

  const setTarget = async (target: number) => {
    if (target >= 0) {
      dispatch(setStepTargetAction({userId: user.uid, stepTarget: target}));
      await AsyncStorage.setItem(DEFAULT_STEP, JSON.stringify(target));
    }
  };

  useEffect(() => {
    (async () => {
      await getStepsByMonth({userId: user.uid, month: new Date().getMonth()});
    })();
  }, [monthSteps]);

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
        fill={stepTarget === 0 ? 100 : (dailySteps / stepTarget) * 100}
        tintColor="#00e0ff"
        backgroundColor="#3d5875">
        {fill => (
          <View style={{alignItems: 'center'}}>
            <Text style={styles.step}>{dailySteps}</Text>

            <Text style={{color: 'white', fontSize: 16}}>
              {stepTarget === 0 ? 'steps' : `of ${stepTarget} steps`}
            </Text>
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
      <View style={{height: 200, backgroundColor: 'tomato'}}>
        <StepChart></StepChart>
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
  }
});
