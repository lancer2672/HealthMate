import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  FlatList
} from 'react-native';
import React, {useState} from 'react';
// import SearchInput from '../components/SearchInput.component';
import Entypo from 'react-native-vector-icons/Entypo';
import ListFood from '../components/ListFood.component';

export default function DetailMealDate({route, navigation}) {
  const {day, month, year} = route.params.data;
  console.log('day', day);
  const [currentDate, setCurrentDate] = useState(new Date(year, month, day));
  console.log('Date', currentDate.getDate());
  const [foodMeal, setFoodMeal] = useState([]);
  // const [date, setDate] = useState(new Date());

  const handleShowResults = () => {
    setShowResults(true);
  };

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
  };

  const handleNavigateSeacrch = mealName => {
    console.log('currentDate', currentDate);
    const serializableDate = currentDate.toISOString();
    navigation.navigate('Search food', {
      data: {
        mealName: mealName,
        currentDate: serializableDate
      }
    });
  };

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
        <Text>0 cal intacke</Text>
        <Text>0 cal burned</Text>
        <Text>remaining 2000</Text>
      </View>
      <ListFood
        mealName="Breakfast"
        foodMeal={foodMeal}
        handleNavigateSeacrch={() => {
          handleNavigateSeacrch('breakfast');
        }}
      />
      <ListFood
        mealName="Lunch"
        foodMeal={foodMeal}
        handleNavigateSeacrch={() => {
          handleNavigateSeacrch('lunch');
        }}
      />
      <ListFood
        mealName="Dinner"
        foodMeal={foodMeal}
        handleNavigateSeacrch={() => {
          handleNavigateSeacrch('dinner');
        }}
      />
      <ListFood
        mealName="Snacks"
        foodMeal={foodMeal}
        handleNavigateSeacrch={() => {
          handleNavigateSeacrch('snacks');
        }}
      />
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
