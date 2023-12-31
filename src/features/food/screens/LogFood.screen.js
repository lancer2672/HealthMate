import {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import ListFoodCard from '../components/ListFoodCard.component';

import {API_KEY_NUTRITIONIX, APP_ID_NUTRITIONIX} from '@env';
import axios from 'axios';
import {addFoodToHistory} from 'src/services/firebase/database/meal-history';
import {useAppDispatch, useAppSelector} from 'src/store/hooks';
import {userSelector} from 'src/store/selectors';

export default function LogFood({route, navigation}) {
  const {date, mealName, item, type} = route.params.data;
  const {user} = useAppSelector(userSelector);
  const dispatch = useAppDispatch();
  // const {foodMeals} = useSelector(state => state.foodMeal);

  const [foodCommon, setFoodCommon] = useState([]);
  const [foodBranded, setFoodBranded] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [totalCalories, setTotalCalories] = useState(0);
  const [totalProtein, setTotalProtein] = useState(0);
  const [totalFat, setTotalFat] = useState(0);
  const [totalCarbohydrate, setTotalCarbohydrate] = useState(0);

  const handleNavigateSeacrch = mealName => {
    navigation.push('Search food', {
      data: {
        mealName: mealName,
        currentDate: date
      }
    });
  };

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
          const data = response.data.foods;
          const food = {
            type: 'common',
            ...data[0],
            realQty: data[0].serving_qty,
            realUnit: data[0].serving_unit,
            realGrams: data[0].serving_weight_grams,
            realCalories: data[0].nf_calories,
            realProtein: data[0].nf_protein,
            realFat: data[0].nf_total_fat,
            realCarbo: data[0].nf_total_carbohydrate
          };
          setFoodCommon([food]);
          setIsLoading(false);
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

  useEffect(() => {
    async function fetch() {
      await fetchData();
    }
    fetch();
  }, []);

  useEffect(() => {
    getTotalCalories();
    getTotalProtein();
    getTotalFat();
    getTotalCarbohydrate();
  }, [foodCommon]);

  const updateFoodData = updatedData => {
    setFoodCommon(updatedData);
  };

  const getTotalCalories = () => {
    console.log('foodCommon130', foodCommon);
    let total = 0;
    foodCommon.forEach(item => {
      total += item.realCalories;
    });
    foodBranded.forEach(item => {
      total += item.realCalories;
    });
    console.log('total', total);
    setTotalCalories(total);
  };

  const getTotalProtein = () => {
    let total = 0;
    foodCommon.forEach(item => {
      total += item.realProtein;
    });
    foodBranded.forEach(item => {
      total += item.realProtein;
    });
    console.log('total2', total);
    setTotalProtein(total);
  };

  const getTotalFat = () => {
    let total = 0;
    foodCommon.forEach(item => {
      total += item.realFat;
    });
    foodBranded.forEach(item => {
      total += item.realFat;
    });
    setTotalFat(total);
  };

  const getTotalCarbohydrate = () => {
    let total = 0;
    foodCommon.forEach(item => {
      total += item.realCarbo;
    });
    foodBranded.forEach(item => {
      total += item.realCarbo;
    });
    setTotalCarbohydrate(total);
  };

  const handleLogFood = async () => {
    if (foodCommon.length !== 0 || foodBranded.length !== 0) {
      // const foodMeal = {
      //   userId: user.uid,
      //   mealName: mealName,
      //   date: date,
      //   food: {
      //     type: 'common',
      //     foodName: foodCommon[0].food_name,
      //     photo: foodCommon[0].photo,
      //     realQty: foodCommon[0].realQty,
      //     realUnit: foodCommon[0].realUnit,
      //     realGrams: foodCommon[0].realGrams,
      //     realCalories: foodCommon[0].nf_calories,
      //     nix_item_id: type === 'branded' ? foodCommon[0].nix_item_id : null,
      //     realProtein: foodCommon[0].nf_protein,
      //     realFat: foodCommon[0].nf_total_fat,
      //     realCarbo: foodCommon[0].nf_total_carbohydrate,
      //     realCarbo: foodCommon[0].nf_total_carbohydrate,
      //     tag_id: foodCommon[0].tags.tag_id
      //   }
      // };
      const food = {
        type: 'common',
        foodName: foodCommon[0].food_name,
        photo: foodCommon[0].photo,
        realQty: foodCommon[0].realQty,
        realUnit: foodCommon[0].realUnit,
        realGrams: foodCommon[0].realGrams,
        realCalories: foodCommon[0].nf_calories,
        nix_item_id: type === 'branded' ? foodCommon[0].nix_item_id : null,
        realProtein: foodCommon[0].nf_protein,
        realFat: foodCommon[0].nf_total_fat,
        realCarbo: foodCommon[0].nf_total_carbohydrate,
        realCarbo: foodCommon[0].nf_total_carbohydrate,
        tag_id: foodCommon[0].tags.tag_id,
        isDone: false
      };
      await addFoodToHistory({userId: user.uid, mealType: mealName, food});
      // dispatch(addFoodMeal(foodMeal));
    }
    navigation.navigate('TodayMealDate');
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
      {isLoading ? (
        <></>
      ) : (
        <>
          <View>
            <ListFoodCard
              data={foodCommon}
              onUpdate={updateFoodData}
              navigation={navigation}
            />
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
                {totalCalories}
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
                <Text
                  style={{color: 'green', fontWeight: 'bold', fontSize: 16}}>
                  {totalProtein}
                </Text>
                <Text>g protein</Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                <Text
                  style={{color: 'green', fontWeight: 'bold', fontSize: 16}}>
                  {totalFat}
                </Text>
                <Text>g fat</Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                <Text
                  style={{color: 'green', fontWeight: 'bold', fontSize: 16}}>
                  {totalCarbohydrate}
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
        </>
      )}
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
