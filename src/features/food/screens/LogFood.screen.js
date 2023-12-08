import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  FlatList,
  Button
} from 'react-native';
import React, {useEffect, useState} from 'react';
import SearchInput from '../components/SearchInput.component';
import FoodCard from '../components/FoodCard.component';
import {addFoodMeal} from '../../../store/reducer/thunks/foodMealActions';
import {useAppDispatch, useAppSelector} from 'src/store/hooks';

import axios from 'axios';
import {APP_ID_NUTRITIONIX, API_KEY_NUTRITIONIX} from '@env';
import {userSelector} from 'src/store/selectors';
import {useSelector} from 'react-redux';

export default function LogFood({route, navigation}) {
  const {date, mealName, item, type} = route.params.data;
  const [food, setFood] = useState([]);
  const {user} = useSelector(state => state.user);
  const dispatch = useAppDispatch();
  const {foodMeals} = useSelector(state => state.foodMeal);

  const [foodCommon, setFoodCommon] = useState([]);
  const [foodBranded, setFoodBranded] = useState([]);

  const handleNavigateSeacrch = mealName => {
    navigation.push('Search food', {
      data: {
        mealName: mealName,
        currentDate: date
      }
    });
  };

  useEffect(() => {
    console.log('user', user);
    const fetchData = async () => {
      switch (type) {
        case 'common': {
          try {
            const response = await axios.post(
              'https://trackapi.nutritionix.com/v2/natural/nutrients',
              {
                query: item.food_name
              },
              {
                headers: {
                  'Content-Type': 'application/json',
                  'x-app-id': APP_ID_NUTRITIONIX,
                  'x-app-key': API_KEY_NUTRITIONIX
                }
              }
            );
            // console.log('response', response);
            const data = response.data.foods;
            // const food = {
            //   photo: data[0].photo.thumb,
            //   food_name: data[0].food_name,
            //   serving_qty: data[0].serving_qty,
            //   serving_unit: data[0].serving_unit,
            //   nf_calories: data[0].nf_calories,
            //   nf_protein: data[0].nf_protein,
            //   nf_total_fat: data[0].nf_total_fat,
            //   nf_total_carbohydrate: data[0].nf_total_carbohydrate,
            //   alt_measures: data[0].alt_measures
            // };
            if (foodCommon.length === 0) {
              console.log('0', data);
              setFoodCommon([data[0]]);
            } else {
              setFoodCommon([...foodCommon, data[0]]);
            }
          } catch (error) {
            console.error('Error searching for food:', error);
          }
          break;
        }
        case 'branded':
          {
            try {
              console.log('item', item.nix_item_id);
              const response = await axios.get(
                'https://trackapi.nutritionix.com/v2/search/item?nix_item_id=' +
                  item.nix_item_id,
                {
                  headers: {
                    'Content-Type': 'application/json',
                    'x-app-id': APP_ID_NUTRITIONIX,
                    'x-app-key': API_KEY_NUTRITIONIX
                  }
                }
              );
              const data = response.data.foods;
              const food = data[0];
              console.log('food', food);
              setFoodCommon([food]);
            } catch (error) {
              console.error('Error searching for food:', error);
            }
          }
          break;
        default:
          break;
      }
    };

    fetchData();
  }, []);

  const getAltMeasures = item => {
    return item.alt_measures.map(item => ({
      label: item.measure,
      value: item.measure
    }));
  };

  const getTotalCalories = () => {
    let total = 0;
    foodCommon.forEach(item => {
      total += item.nf_calories;
    });
    foodBranded.forEach(item => {
      total += item.nf_calories;
    });
    return total;
  };

  const getTotalProtein = () => {
    let total = 0;
    foodCommon.forEach(item => {
      total += item.nf_protein;
    });
    foodBranded.forEach(item => {
      total += item.nf_protein;
    });
    return total;
  };

  const getTotalFat = () => {
    let total = 0;
    foodCommon.forEach(item => {
      total += item.nf_total_fat;
    });
    foodBranded.forEach(item => {
      total += item.nf_total_fat;
    });
    return total;
  };

  const getTotalCarbohydrate = () => {
    let total = 0;
    foodCommon.forEach(item => {
      total += item.nf_total_carbohydrate;
    });
    foodBranded.forEach(item => {
      total += item.nf_total_carbohydrate;
    });
    return total;
  };

  const handleLogFood = async () => {
    const foodMeal = {
      userId: user.uid,
      mealName: mealName,
      date: date,
      food: {
        type: 'common',
        foodName: foodCommon[0].food_name,
        servingQty: foodCommon[0].serving_qty,
        servingUnit: foodCommon[0].serving_unit,
        calories: foodCommon[0].nf_calories,
        nix_item_id: type === 'branded' ? foodCommon[0].nix_item_id : null
      }
    };
    dispatch(addFoodMeal(foodMeal));
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <TouchableOpacity
        style={{padding: 10}}
        onPress={() => handleNavigateSeacrch()}>
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
      <View>
        <FoodCard data={foodCommon} />
      </View>
      <View style={{backgroundColor: 'lightgrey'}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 10,
            borderBottomWidth: 1,
            borderBottomColor: 'gray'
          }}>
          <Text style={{fontSize: 16, color: 'black'}}>Total calories</Text>
          <Text style={{color: 'green', fontWeight: 'bold', fontSize: 16}}>
            {getTotalCalories()}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            padding: 10,
            borderBottomWidth: 1,
            borderBottomColor: 'gray'
          }}>
          <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
            <Text style={{color: 'green', fontWeight: 'bold', fontSize: 16}}>
              {getTotalProtein()}
            </Text>
            <Text>g protein</Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
            <Text style={{color: 'green', fontWeight: 'bold', fontSize: 16}}>
              {getTotalFat()}
            </Text>
            <Text>g fat</Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
            <Text style={{color: 'green', fontWeight: 'bold', fontSize: 16}}>
              {getTotalCarbohydrate()}
            </Text>
            <Text>g carbs</Text>
          </View>
        </View>
      </View>
      <View style={{padding: 10, alignItems: 'center'}}>
        <TouchableOpacity
          style={{
            padding: 10,
            paddingLeft: 30,
            paddingRight: 30,
            backgroundColor: 'blue',
            borderRadius: 5
          }}
          onPress={() => handleLogFood()}>
          <Text
            style={{
              color: 'white',
              textAlign: 'center',
              fontSize: 16,
              fontWeight: 'bold'
            }}>
            Log food
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray'
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 5,
    width: 40,
    fontSize: 16,
    // alignContent: 'center',
    textAlign: 'center'
  }
});
