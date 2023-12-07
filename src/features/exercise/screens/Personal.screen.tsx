import {
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import React, {useState, useEffect} from 'react';
import ExerciseCardItemScreen from '../components/list/ExerciseCardItem';
import {ScrollView} from 'react-native';
import DropDownCategory from '../components/DropdownCategory';
import axiosClient from 'src/api/axiosClient';
import {EXERCISE_BASE_URL} from 'src/constants';
import ListExerciseBody from '../components/list/ListExerciseBody';
import ListTargetExercise from '../components/list/ListTargetExercise';
import exerciseApi from 'src/api/exerciseApi';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {setSelectedPlan} from 'src/store/reducer/exerciseSlice';

const Personal = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [recommendedPlan, setRecommendedPlan] = useState(null);
  const navigateToDetailPlan = () => {
    if (recommendedPlan) {
      dispatch(setSelectedPlan(recommendedPlan));
      navigation.navigate('DetailPlan');
    }
  };
  const getRecommendedExercises = async () => {
    const exerciseIds = ['0001', '0464', '1311', '0514'];
    const exercisePromises = exerciseIds.map(id =>
      exerciseApi.getExerciseById(id)
    );
    return await Promise.all(exercisePromises);
  };
  const createRecommendedPlan = exercises => {
    const updatedExercises = exercises.map(exercise => ({
      ...exercise,
      duration: 60,
      breakDuration: 15
    }));

    return {
      id: Date.now(),
      exercise: updatedExercises,
      isRecommendedPlan: true
    };
  };

  useEffect(() => {
    (async () => {
      const recommendedExercises = await getRecommendedExercises();
      if (recommendedExercises) {
        const recommendedPlan = createRecommendedPlan(recommendedExercises);
        setRecommendedPlan(recommendedPlan);
      }
    })();
  }, []);
  return (
    <ScrollView style={styles.container}>
      <ListExerciseBody></ListExerciseBody>
      <ListTargetExercise></ListTargetExercise>

      <Text style={styles.title}>Recommended for you</Text>
      <TouchableOpacity
        onPress={navigateToDetailPlan}
        style={styles.rcmWrapper}>
        <View style={{flex: 1, paddingVertical: 12, paddingLeft: 12}}>
          <Text style={styles.cardTitle}>
            Just 5 minutes a day can make a difference!
          </Text>
          <Text style={styles.cardSubTitle}>
            {recommendedPlan && `${recommendedPlan.exercise.length} exercise`}
          </Text>
        </View>
        <ImageBackground
          resizeMode="contain"
          style={styles.imgBg}
          source={require('../../../assets/imgs/man_exercise.png')}></ImageBackground>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Personal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    paddingTop: 0
  },
  title: {
    fontSize: 20,
    marginBottom: 4,
    fontWeight: 'bold'
  },
  imgBg: {
    flex: 1,
    height: 140
  },
  rcmWrapper: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'gray',
    marginHorizontal: 14,
    borderRadius: 12
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1
  },
  cardSubTitle: {
    fontSize: 16
    // fontWeight: 'bold'
  }
});
