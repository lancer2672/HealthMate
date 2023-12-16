import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  FlatList
} from 'react-native';
import React, {useEffect, useState, useReducer} from 'react';
// import SearchInput from '../components/SearchInput.component';
import Entypo from 'react-native-vector-icons/Entypo';
import ListFood from '../components/ListFood.component';
import {useAppDispatch, useAppSelector} from 'src/store/hooks';
import {userSelector, foodMealSelector} from 'src/store/selectors';
import {getFoodMealByDate} from 'src/store/reducer/thunks/foodMealActions';
import {useSelector} from 'react-redux';
import {getTotalCalories} from 'src/services/firebase/firestore/foodMeal';

export default function DetailMealDate({route, navigation}) {
  const {day, month, year} = route.params.data;
  const [currentDate, setCurrentDate] = useState(new Date(year, month, day));
  // const [foodMeals, setFoodMeals] = useState([]); // [breakfast, lunch, dinner, snacks
  const [foodBreakfast, setFoodBreakfast] = useState([]);
  const [foodLunch, setFoodLunch] = useState([]);
  const [foodDinner, setFoodDinner] = useState([]);
  const [foodSnacks, setFoodSnacks] = useState([]);
  const [totalCalories, setTotalCalories] = useState(1110);
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useAppDispatch();
  const {user} = useSelector(userSelector);
  const {foodMeals} = useSelector(foodMealSelector);
  // const totalCalories = useSelector(state => state.foodMeals.totalCalories);

  // const handleShowResults = () => {
  //   setShowResults(true);
  // };

  const isToday = () => {
    const today = new Date();
    return (
      today.getDate() === currentDate.getDate() &&
      today.getMonth() === currentDate.getMonth() &&
      today.getFullYear() === currentDate.getFullYear()
    );
  };

  const nameDay = () => {
    const dayOfWeek = currentDate.getDay();
    const daysOfWeek = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday'
    ];
    return daysOfWeek[dayOfWeek];
  };

  const handleChangeDate = amount => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + amount);
    setCurrentDate(newDate);
    setIsLoading(true);
    dispatch(
      getFoodMealByDate({
        userId: user.uid,
        date: newDate.toISOString(),
        mealName: 'breakfast'
      })
    );
  };

  const handleNavigateSeacrch = mealName => {
    const serializableDate = currentDate.toISOString();
    navigation.navigate('Search food', {
      data: {
        mealName: mealName,
        currentDate: serializableDate
      }
    });
  };

  const getCalories = async () => {
    try {
      const totalCalories = await getTotalCalories(
        user.uid,
        currentDate.toISOString()
      );
      return totalCalories;
      // You can set the totalCalories to state or use it as needed in your component
    } catch (error) {
      console.error('Error fetching total calories:', error);
    }
  };

  useEffect(() => {
    console.log('user', user);
    if (user) {
      dispatch(
        getFoodMealByDate({
          userId: user.uid,
          date: currentDate.toISOString(),
          mealName: 'breakfast'
        })
      );
    }
  }, []);

  useEffect(() => {
    setFoodBreakfast(foodMeals[0].food);
    setFoodLunch(foodMeals[1].food);
    setFoodDinner(foodMeals[2].food);
    setFoodSnacks(foodMeals[3].food);
    setTotalCalories(foodMeals.totalCalories);
    console.log('foodMeals119', foodMeals);
    setIsLoading(false);
  }, [foodMeals]);

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <TouchableOpacity
        style={{padding: 10}}
        onPress={() => {
          handleNavigateSeacrch();
        }}>
        <View
          style={{
            borderRadius: 25,
            borderWidth: 1,
            padding: 15
          }}>
          <Text style={{paddingLeft: 20, fontSize: 16, color: 'black'}}>
            Search foods to log
          </Text>
        </View>
      </TouchableOpacity>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor: 'gray',
          padding: 10
        }}>
        <TouchableOpacity
          style={{width: 30}}
          onPress={() => {
            handleChangeDate(-1);
          }}>
          <Entypo name="chevron-left" size={32} color="white"></Entypo>
        </TouchableOpacity>
        <View>
          <Text style={{color: 'white', fontSize: 20}}>
            {(isToday() ? 'Today' : nameDay()) +
              ', ' +
              currentDate.getDate() +
              '/' +
              (currentDate.getMonth() + 1) +
              '/' +
              currentDate.getFullYear()}
          </Text>
        </View>
        <TouchableOpacity
          style={{width: 30}}
          onPress={() => handleChangeDate(1)}>
          <Entypo name="chevron-right" size={32} color="white"></Entypo>
        </TouchableOpacity>
      </View>
      <View style={styles.calContainer}>
        <Text>{totalCalories} cal intacke</Text>
        <Text>0 cal burned</Text>
        <Text>remaining 2000</Text>
      </View>
      {isLoading ? (
        <></>
      ) : (
        <View>
          <ListFood
            mealName="Breakfast"
            foodMeal={foodBreakfast}
            handleNavigateSeacrch={() => {
              handleNavigateSeacrch('breakfast');
            }}
            navigation={navigation}
          />
          <ListFood
            mealName="Lunch"
            foodMeal={foodLunch}
            handleNavigateSeacrch={() => {
              handleNavigateSeacrch('lunch');
            }}
            navigation={navigation}
          />
          <ListFood
            mealName="Dinner"
            foodMeal={foodDinner}
            handleNavigateSeacrch={() => {
              handleNavigateSeacrch('dinner');
            }}
            navigation={navigation}
          />
          <ListFood
            mealName="Snacks"
            foodMeal={foodSnacks}
            handleNavigateSeacrch={() => {
              handleNavigateSeacrch('snacks');
            }}
            navigation={navigation}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  calContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 5,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderColor: 'blue'
  },
  mealContainer: {
    flexDirection: 'column',
    // margin: 10,
    borderBottomWidth: 1,
    borderColor: 'blue'
  },
  mealName: {
    textTransform: 'uppercase',
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black'
  }
});
