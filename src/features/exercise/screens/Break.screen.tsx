import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {CountdownCircleTimer} from 'react-native-countdown-circle-timer';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useTheme} from 'styled-components';
import {useDispatch, useSelector} from 'react-redux';
import {exerciseSelector} from 'src/store/selectors';
import Timer from 'src/components/Timer';
import {convertSecondsToMinutesAndSeconds} from 'src/utils/dateTimeHelper';
import {Button} from 'react-native-paper';
import buttonStyles from 'src/features/theme/styles/button';
import {
  setCurrentExercise,
  setDoExercise
} from 'src/store/reducer/exerciseSlice';
import {withBackButtonHandler} from 'src/hoc/withBackBtnHandler';

const BreakScreen = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const route = useRoute<any>();
  const theme = useTheme();
  const {breakDuration, exericseTime} = route.params;
  const dispatch = useDispatch<any>();
  const [timerValue, setTimerValue] = useState(breakDuration || 0);
  const {currentExercise, doExercise} = useSelector(exerciseSelector);

  const navigation = useNavigation<any>();
  const {selectedPlan} = useSelector(exerciseSelector);
  const startSession = () => {
    // setIsShowPlanList(true);
    setIsPlaying(true);
  };
  const stopSession = () => {
    setIsPlaying(false);
  };
  const navigateToStartSession = () => {
    // navigation.replace('StartPlan');
  };

  const handleNavigateToNextExercise = () => {
    // save break duration to history
    dispatch(
      setDoExercise(
        doExercise.map(i => {
          if (i.exerciseId === currentExercise.id) {
            return {
              ...i,
              breakDuration: timerValue
            };
          }
          return i;
        })
      )
    );
    const nextExercise = selectedPlan.exercise[currentExercise.index + 1];
    if (nextExercise) {
      dispatch(
        setCurrentExercise({
          ...nextExercise,
          index: currentExercise.index + 1
        })
      );
      navigation.navigate('DoExercise');
      resetTimer();
    }
  };
  const navigateToDetailExercise = () => {
    setIsPlaying(false);
    navigation.navigate('DetailExercise', {exercise: currentExercise});
  };
  const addBreakTime = time => {
    setTimerValue(() => timerValue + time);
  };
  const resetTimer = () => {
    setTimerValue(10);
  };
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View
        style={{
          flex: 1,
          borderBottomLeftRadius: 25,
          borderBottomRightRadius: 25,
          backgroundColor: 'white',
          alignItems: 'center'
        }}>
        <Image
          source={{uri: currentExercise.gifUrl}}
          resizeMode="contain"
          style={{width: '100%', height: '100%', flex: 1}}></Image>
      </View>

      <View
        style={{
          flex: 2,
          elevation: 1,
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
          paddingVertical: 12,
          alignItems: 'center',

          backgroundColor: theme.green1,
          width: '100%'
        }}>
        <View
          style={{
            alignSelf: 'flex-start',
            flexDirection: 'row',
            marginLeft: 12
          }}>
          <Text style={styles.text0}>Next exercise </Text>
          <Text style={styles.text1}>
            {`${currentExercise.index} / ${selectedPlan.exercise.length}`}
          </Text>
        </View>
        <View
          style={{
            alignSelf: 'flex-start',
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: 12
          }}>
          <Text style={styles.text1}>{`${
            currentExercise.name
          } - ${convertSecondsToMinutesAndSeconds(
            currentExercise.duration
          )}`}</Text>

          <TouchableOpacity
            onPress={navigateToDetailExercise}
            style={{padding: 4, marginLeft: 12}}>
            <AntDesign name="questioncircleo" size={24} color={'white'} />
          </TouchableOpacity>
        </View>
        <Text style={[styles.time, {marginVertical: 12}]}>
          Next exercise start in
        </Text>
        <View style={{flexDirection: 'row'}}>
          <Timer
            textStyle={{color: 'white'}}
            onEnd={handleNavigateToNextExercise}
            onChange={setTimerValue}
            value={timerValue}
            isPlaying={isPlaying}></Timer>
        </View>
        <Button
          style={[
            buttonStyles.primary,
            {backgroundColor: '#5c8973', borderColor: 'white', width: '50%'}
          ]}
          mode="contained"
          // onPress={isPlaying ? stopSession : startSession}
          onPress={() => addBreakTime(15)}>
          + 15 seconds
        </Button>

        <Button
          style={[
            buttonStyles.primary,
            {backgroundColor: '#5c8973', borderColor: 'white', width: '50%'}
          ]}
          icon="arrow-right"
          mode="contained"
          // onPress={isPlaying ? stopSession : startSession}
          onPress={handleNavigateToNextExercise}>
          SKIP
        </Button>
      </View>
    </View>
  );
};

export default withBackButtonHandler(BreakScreen);

const styles = StyleSheet.create({
  time: {
    fontSize: 36,
    color: 'white',
    fontWeight: 'bold'
  },
  text0: {opacity: 0.8, fontSize: 18, color: 'white'},
  text1: {fontSize: 18, fontWeight: 'bold', color: 'white'}
});
