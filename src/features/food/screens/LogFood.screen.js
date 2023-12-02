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

import axios from 'axios';
import {APP_ID_NUTRITIONIX, API_KEY_NUTRITIONIX} from '@env';
import RNPickerSelect from 'react-native-picker-select';
import AntDesign from 'react-native-vector-icons/AntDesign';

export default function LogFood({route, navigation}) {
  const {date, mealName, item, type} = route.params.data;

  const [foodCommon, setFoodCommon] = useState([]);
  const [foodBranded, setFoodBranded] = useState([]);

  useEffect(() => {
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
            const food = {
              photo: data[0].photo.thumb,
              food_name: data[0].food_name,
              serving_qty: data[0].serving_qty,
              serving_unit: data[0].serving_unit,
              nf_calories: data[0].nf_calories,
              nf_protein: data[0].nf_protein,
              nf_total_fat: data[0].nf_total_fat,
              nf_total_carbohydrate: data[0].nf_total_carbohydrate,
              alt_measures: data[0].alt_measures
            };
            setFoodCommon([food]);
          } catch (error) {
            console.error('Error searching for food:', error);
          }
          break;
        }
        case 'branded':
          setFoodBranded(item);
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

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      {/* <TouchableOpacity
        style={{padding: 10}}
        onPress={() => {
          handleNavigateSeacrch();
        }}> */}
      <TouchableOpacity style={{padding: 10}}>
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
        {foodCommon.map((item, index) => (
          <View key={index} style={styles.cardContainer}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8
              }}>
              <Image
                source={{uri: item.photo}}
                style={{width: 50, height: 50}}
              />
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    maxWidth: '80%',
                    gap: 10
                  }}>
                  <TextInput
                    style={styles.textInput}
                    keyboardType="numeric"
                    value="1"
                  />
                  {/* <RNPickerSelect items={getAltMeasures(item)} /> */}
                  <TextInput
                    style={[
                      styles.textInput,
                      {
                        width: 180
                      }
                    ]}
                    value={item.serving_unit}
                  />
                </View>
                <Text style={{fontSize: 16, color: 'black'}}>
                  {item.food_name}
                </Text>
              </View>
              <TouchableOpacity>
                <AntDesign
                  name="infocirlce"
                  size={18}
                  color="black"></AntDesign>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: 'column',
                alignItems: 'flex-end'
              }}>
              <Text style={{color: 'green', fontWeight: 'bold', fontSize: 16}}>
                {item.nf_calories}
              </Text>
              <Text>cal</Text>
            </View>
          </View>
        ))}
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
          }}>
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
