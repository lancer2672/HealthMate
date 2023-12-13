import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {CountdownCircleTimer} from 'react-native-countdown-circle-timer';
import Entypo from 'react-native-vector-icons/Entypo';
import {useDispatch, useSelector} from 'react-redux';
import {exerciseSelector} from 'src/store/selectors';
import {withBackButtonHandler} from 'src/hoc/withBackBtnHandler';
import {setDoExercise} from 'src/store/reducer/exerciseSlice';
import audioServiceIns from 'src/services/audio/audioIns';

const ReadyExercise = () => {
  const route = useRoute<any>();
  const dispatch = useDispatch();
  const {currentExercise, selectedPlan} = useSelector(exerciseSelector);
  const navigation = useNavigation<any>();
  const [isPlaying, setIsPlaying] = useState(true);
  const startSession = () => {
    // setIsShowPlanList(true);
    setIsPlaying(true);
  };
  const stopSession = () => {
    setIsPlaying(false);
  };
  const navigateToStartSession = () => {
    dispatch(setDoExercise([]));
    navigation.replace('DoExercise');
  };
  useEffect(() => {
    audioServiceIns.play();
  }, []);
  return (
    <View style={{flex: 1}}>
      <View style={{flex: 2, alignItems: 'center'}}>
        <Image
          source={{uri: currentExercise.gifUrl}}
          style={{width: '100%', height: '100%'}}></Image>
        <Text>ReadyExercise</Text>
      </View>
      <View
        style={{
          flex: 1.3,
          elevation: 1,
          paddingVertical: 12,
          alignItems: 'center',
          backgroundColor: 'white',
          width: '100%'
        }}>
        <Text style={[styles.time, {marginVertical: 12}]}>
          Your session start in
        </Text>
        <View style={{flexDirection: 'row'}}>
          <CountdownCircleTimer
            key={Date.now()}
            isPlaying={true}
            duration={15}
            //   initialRemainingTime={15}
            onComplete={() => {
              navigateToStartSession();
              stopSession();
              return {shouldRepeat: false};
            }}
            colors={[`#5c8973`, '#73af92', '#90d4af']}>
            {({remainingTime}) => (
              <Text style={styles.time}>{remainingTime}</Text>
            )}
          </CountdownCircleTimer>
          <TouchableOpacity
            style={{
              padding: 4,
              position: 'absolute',
              alignSelf: 'center',
              right: -60
            }}
            onPress={navigateToStartSession}>
            <Entypo name="chevron-right" size={50} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default withBackButtonHandler(ReadyExercise);

const styles = StyleSheet.create({
  time: {
    fontSize: 36,
    fontWeight: 'bold'
  }
});
