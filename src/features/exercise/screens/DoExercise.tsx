import {
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Dimensions,
  Alert
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Button} from 'react-native-paper';
import Carousel from 'react-native-snap-carousel';
import AntDesign from 'react-native-vector-icons/AntDesign';

import buttonStyles from 'src/features/theme/styles/button';
import PlanListModal from '../components/plan/AddPlanModal';
import {useTheme} from 'styled-components';
import {CountdownCircleTimer} from 'react-native-countdown-circle-timer';
import {useDispatch, useSelector} from 'react-redux';
import {exerciseSelector, userSelector} from 'src/store/selectors';
import Timer from 'src/components/Timer';
import {
  setCurrentExercise,
  setDoExercise
} from 'src/store/reducer/exerciseSlice';
import {withBackButtonHandler} from 'src/hoc/withBackBtnHandler';
import {saveHistoryExerciseAction} from 'src/store/reducer/thunks/exerciseActions';
import audioServiceIns from 'src/services/audio/audioIns';
import notifyUser from 'src/utils/notifyUser';

const DoExercise = () => {
  const {currentExercise, doExercise, selectedPlan} =
    useSelector(exerciseSelector);

  const [isPlaying, setIsPlaying] = useState(true);
  const [exerciseTime, setExerciseTime] = useState(currentExercise.duration);
  const route = useRoute<any>();
  const {user} = useSelector(userSelector);
  const dispatch = useDispatch<any>();
  const navigation = useNavigation<any>();
  const theme = useTheme();
  const navigateBack = () => {
    Alert.alert(
      'Are you sure to quit?',
      '',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Quit',
          onPress: () => {
            navigation.navigate('ExerciseHome');
            dispatch(setCurrentExercise(null));
            dispatch(setDoExercise([]));
            setIsPlaying(false);
          }
        }
      ],
      {cancelable: false}
    );
  };
  const resumeTimer = () => {
    // setIsShowPlanList(true);
    setIsPlaying(() => true);
    audioServiceIns.play();
  };
  const pauseTimer = () => {
    setIsPlaying(() => false);
    audioServiceIns.pause();
  };
  // console.log('currentExercise', doExercise, selectedPlan, currentExercise);
  const navigateToBreakScreen = (isSkip = false) => {
    notifyUser();
    if (!isSkip) {
      saveHistory();
    }
    if (currentExercise.index === selectedPlan.exercise.length - 1) {
      navigation.replace('FinishScreen');
    } else {
      navigation.replace('BreakScreen', {
        breakDuration: currentExercise.breakDuration || 15
      });
    }
  };
  const saveHistory = () => {
    console.log('Do Exercise screen , currentex', currentExercise);
    const newDoExerciseHistory = [
      ...doExercise,
      {
        exerciseId: currentExercise.id,
        duration: currentExercise.duration - exerciseTime,
        breakDuration: 0
      }
    ];
    dispatch(setDoExercise(newDoExerciseHistory));
    if (currentExercise.index === selectedPlan.exercise.length - 1) {
      dispatch(
        saveHistoryExerciseAction({
          userId: user.uid,
          planId: selectedPlan.id,
          doExercise: newDoExerciseHistory
        })
      );
    }
  };
  const handleSkip = () => {
    navigateToBreakScreen(true);
  };
  useEffect(() => {
    audioServiceIns.play();
  }, []);
  return (
    <>
      <View style={{paddingBottom: 2}}>
        <View style={[styles.header, {backgroundColor: '#5c8973'}]}>
          <TouchableOpacity onPress={navigateBack}>
            <Ionicons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>{`Session`}</Text>
        </View>
      </View>
      <View style={styles.container}>
        {currentExercise ? (
          <Exericse exercise={currentExercise}></Exericse>
        ) : (
          <></>
        )}
        <Timer
          onEnd={navigateToBreakScreen}
          value={currentExercise.duration}
          onChange={setExerciseTime}
          isPlaying={isPlaying}></Timer>

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Button
            style={[
              buttonStyles.primary,
              {
                backgroundColor: '#5c8973',
                borderColor: '#5c8973',
                width: '70%'
              }
            ]}
            icon={isPlaying ? 'pause' : 'play'}
            mode="contained"
            onPress={isPlaying ? pauseTimer : resumeTimer}>
            {isPlaying ? 'PAUSE' : 'RESUME'}
          </Button>

          <TouchableOpacity
            onPress={handleSkip}
            style={[styles.skip, {position: 'absolute', right: -60}]}>
            <AntDesign name="rightcircleo" size={32} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      {/* <PlanListModal
        visible={isShowPlanList}
        onClose={() => {
          setIsShowPlanList(false);
        }}></PlanListModal> */}
    </>
  );
};

const Exericse = ({exercise}) => {
  const {gifUrl, name} = exercise;
  console.log('gifUrl1', gifUrl);
  return (
    <View
      style={{
        borderRadius: 8,
        flex: 1,
        marginVertical: 24,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
      <Image
        resizeMode="contain"
        source={{uri: gifUrl}}
        style={{width: 300, height: 300}}
      />
      <Text style={[styles.title, {color: '#5c8973'}]}>{name}</Text>
    </View>
  );
};
export default withBackButtonHandler(DoExercise);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',

    padding: 12
  },
  skip: {
    flex: 1,
    paddingVertical: 4,
    marginHorizontal: 12,
    backgroundColor: 'white',
    alignItems: 'center'
  },
  title: {
    fontSize: 32,
    fontWeight: '500',
    marginLeft: 12,

    color: 'white'
  },
  time: {
    color: '#4FA095',
    fontSize: 40,
    fontWeight: '500'
  },

  header: {
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    paddingVertical: 20
    // width: '100%',
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold'
  },
  img: {width: 100, height: 100},
  instruction: {
    marginTop: 4,
    fontSize: 15
  }
});
