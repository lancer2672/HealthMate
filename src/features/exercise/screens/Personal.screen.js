import {useNavigation} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {
  Dimensions,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import {useDispatch, useSelector} from 'react-redux';
import exerciseApi from 'src/api/exerciseApi';
import {GOAL, PLAN_TYPES} from 'src/constants';
import {useActivity} from 'src/hooks/useActivity';
import useMeal from 'src/hooks/useMeal';
import usePlans from 'src/hooks/usePlan';
import {setSelectedPlan} from 'src/store/reducer/exerciseSlice';
import {userSelector} from 'src/store/selectors';
import {
  calculateCaloriesForFitter,
  calculateCaloriesForWeightLoss,
  getCalorieTdee
} from 'src/utils/calorieCalculator';
import ListTargetExercise from '../components/exercise/ListTargetExercise';
import NutrientTag from '../components/home/NutrientTag';

const SCREEN_WIDTH = Dimensions.get('window').width;

const Personal = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  return (
    <ScrollView style={styles.container}>
      <UserCalorie navigation={navigation}></UserCalorie>
      <RecommendedPlan navigation={navigation}></RecommendedPlan>
      <GroupAndUserPlan navigation={navigation}></GroupAndUserPlan>
      <ListTargetExercise></ListTargetExercise>
    </ScrollView>
  );
};

export default Personal;

const RecommendedPlan = ({navigation}) => {
  const dispatch = useDispatch();
  const [recommendedPlan, setRecommendedPlan] = useState(null);

  const navigateToDetailPlan = () => {
    if (recommendedPlan) {
      dispatch(setSelectedPlan(recommendedPlan));
      navigation.navigate('DetailPlan');
    }
  };

  const getRecommendedExercises = async () => {
    // 4.5, 3.4 , 5.5. 10
    const exerciseIds = ['0001', '0464', '1311', '0514'];
    const estimatedMET = [4.5, 3.4, 5.5, 10];
    const exercisePromises = exerciseIds.map(async (id, i) => {
      const ex = await exerciseApi.getExerciseById(id);
      return {
        ...ex,
        MET: estimatedMET[i]
      };
    });
    return await Promise.all(exercisePromises);
  };
  console.log('recommendedPlan', recommendedPlan);
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
    <>
      <Text style={[styles.title, {color: 'gray'}]}>Recommended for you</Text>
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
    </>
  );
};

const subcolor = ['#8024c7', '#356e2a', '#2442c7', '#666e2a'];
const color = ['#ae9bbd', '#60bf4d', '#9b9ebd', '#b2bf4d'];
function UserCalorie({navigation}) {
  const {user} = useSelector(userSelector);
  const [calorieNeedToday, setCalorieNeedToday] = useState(0);
  const [data, setData] = useState([]);
  const {foodIndex} = useMeal();
  const {stepCalorie} = useActivity();
  useEffect(() => {
    if (user) {
      const calorie = getCalorieTdee({...user});
      if (user.goal == GOAL.FITTER) {
        setCalorieNeedToday(calculateCaloriesForFitter(calorie));
      } else if (user.goal == GOAL.LOSE_WEIGHT) {
        setCalorieNeedToday(calculateCaloriesForWeightLoss(calorie));
      } else {
        setCalorieNeedToday(calorie);
      }
    }
  }, [user]);
  console.log('calorieNeedToday', {stepCalorie, foodIndex, calorieNeedToday});
  const getKcalLeft = () => {
    if (!foodIndex) return calorieNeedToday;

    const calorieLeft =
      calorieNeedToday - getCalorieAbsorb() + getCalorieBurnt();
    return calorieLeft > 0 ? calorieLeft : 0;
  };

  const getCalorieAbsorb = () => {
    return foodIndex ? foodIndex.realCalories.absorb : 0;
  };

  const getCalorieBurnt = () => {
    return stepCalorie;
  };
  useEffect(() => {
    if (foodIndex) {
      const foodIndexArr = [];
      for (const [nutrient, value] of Object.entries(foodIndex)) {
        if (nutrient === 'realCalories') {
          continue;
        }
        const d = {
          ...value,
          nutrient: nutrient.substring(4, 8),
          background: color[foodIndexArr.length],
          bgCircle: subcolor[foodIndexArr.length]
        };
        foodIndexArr.push(d);
      }
      console.log('foodIndexArr', {stepCalorie, foodIndexArr});
      setData(foodIndexArr);
    }
  }, [foodIndex]);
  return (
    <View style={[styles.container, {backgroundColor: 'black'}]}>
      <Text style={styles.title}>Count Your Daily Calories</Text>
      <View style={[styles.subContainer]}>
        <View style={styles.des}>
          <Text style={styles.sub1}>EATEN</Text>
          <Text style={styles.sub2}>{getCalorieAbsorb()} Kcal</Text>
        </View>
        <View style={styles.circle}>
          <Text style={[styles.sub2, {fontSize: 20}]}>
            {getKcalLeft().toFixed(0)}
          </Text>
          <Text style={[styles.sub2, {fontSize: 16}]}>Kcal left</Text>
        </View>
        <View style={styles.des}>
          <Text style={styles.sub1}>BURNED</Text>
          <Text style={styles.sub2}>{getCalorieBurnt()} Kcal</Text>
        </View>
      </View>

      <View style={styles.tagContainer}>
        {data.map(i => {
          return <NutrientTag {...i}></NutrientTag>;
        })}
      </View>
    </View>
  );
}
function GroupAndUserPlan({navigation}) {
  const {todayPlan, groupPlan} = usePlans();
  const dispatch = useDispatch();

  const handleNavigateToDetailPlan = item => {
    dispatch(setSelectedPlan(item));
    navigation.navigate('DetailPlan');
  };

  if (!todayPlan && !groupPlan) {
    return <></>;
  }
  return (
    <View style={{flex: 1}}>
      <Text style={styles.title}>Start a plan</Text>
      <Carousel
        loop
        width={SCREEN_WIDTH - 20}
        height={SCREEN_WIDTH / 2}
        autoPlay={true}
        pagingEnabled
        autoPlayInterval={2500}
        data={[todayPlan, groupPlan].filter(a => a)}
        scrollAnimationDuration={1000}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => handleNavigateToDetailPlan(item)}
            style={styles.rcmWrapper}>
            <View style={{flex: 1, paddingVertical: 12, paddingLeft: 12}}>
              <Text style={styles.cardTitle}>
                {item.type === PLAN_TYPES.GROUP
                  ? 'Group plan'
                  : 'Your daily plan'}
                {' - '}
                {item.planName}
              </Text>

              <Text style={styles.cardSubTitle}>
                {item.exercise?.length} exercise
              </Text>
            </View>
            <ImageBackground
              resizeMode="contain"
              style={styles.imgBg}
              source={
                item.type === PLAN_TYPES.GROUP
                  ? require('../../../assets/imgs/group_exericse.jpg')
                  : require('../../../assets/imgs/personal_plan.png')
              }></ImageBackground>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 8,
    borderRadius: 12,
    paddingTop: 0
  },
  des: {
    alignItems: 'center',
    marginVertical: 12
  },
  sub1: {
    color: 'white'
  },
  circle: {
    width: 90,
    height: 90,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 1000,
    backgroundColor: 'tomato'
  },
  sub2: {
    color: 'white',
    fontWeight: 'bold'
  },
  subContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10
  },
  tagContainer: {
    flexDirection: 'row'
  },
  title: {
    fontSize: 20,
    marginVertical: 8,
    fontWeight: 'bold',
    color: 'white'
  },
  imgBg: {
    flex: 1,
    height: 140
  },
  rcmWrapper: {
    flexDirection: 'row',
    borderWidth: 2,
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
