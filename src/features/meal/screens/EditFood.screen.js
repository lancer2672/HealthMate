import {API_KEY_NUTRITIONIX, APP_ID_NUTRITIONIX} from '@env';
import axios from 'axios';
import {format} from 'date-fns';
import {useEffect, useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NutriFact from 'src/components/NutriFact';

export default function EditFood({route, navigation}) {
  const {mealName, foodMeal} = route.params.data;
  console.log('foodMeal22', foodMeal);

  const [foodData, setFoodData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  const fetchFoodData = async () => {
    switch (foodMeal.type) {
      case 'common':
        {
          try {
            const response = await axios.post(
              'https://trackapi.nutritionix.com/v2/natural/nutrients',
              {
                query: foodMeal.foodName
              },
              {
                headers: {
                  'Content-Type': 'application/json',
                  'x-app-id': APP_ID_NUTRITIONIX,
                  'x-app-key': API_KEY_NUTRITIONIX
                }
              }
            );
            const data = {
              id: foodMeal.id,
              date: foodMeal.date,
              mealName: mealName,
              realQty: foodMeal.realQty,
              realUnit: foodMeal.realUnit,
              realGrams: foodMeal.realGrams,
              realCalories: foodMeal.realCalories,
              realProtein: foodMeal.realProtein,
              realFat: foodMeal.realFat,
              realCarbo: foodMeal.realCarbo,
              ...response.data.foods[0]
            };
            console.log('data', data);
            setFoodData(data);
            setIsLoading(false);
            setIsButtonEnabled(false);
          } catch (error) {
            console.error('Error searching for food:', error);
          }
        }
        break;
      case 'branded':
        {
          try {
            const response = await axios.get(
              'https://trackapi.nutritionix.com/v2/search/item?nix_item_id=' +
                foodMeal.nix_item_id,
              {
                headers: {
                  'Content-Type': 'application/json',
                  'x-app-id': APP_ID_NUTRITIONIX,
                  'x-app-key': API_KEY_NUTRITIONIX
                }
              }
            );
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
    fetchFoodData();
  }, []);

  useEffect(() => {
    setIsButtonEnabled(true);
  }, [foodData]);

  const handleSave = () => {
    // Xử lý khi nút được bấm
  };

  const getAltMeasures = foodItem => {
    const data = foodItem.alt_measures.map(measureItem => ({
      label: measureItem.measure,
      value: measureItem.measure
    }));
    return data;
  };

  const handleQtyChange = text => {
    const {realQty, realGrams} = foodData;
    if (realGrams != 0) {
      const factor = text / realQty;
      const realGrams = foodData.realGrams * factor;
      const realCalories = foodData.realCalories * factor;
      const realProtein = foodData.realProtein * factor;
      const realFat = foodData.realFat * factor;
      const realCarbo = foodData.realCarbo * factor;
      setFoodData({
        ...foodData,
        realQty: text,
        realGrams,
        realCalories,
        realProtein,
        realFat,
        realCarbo
      });
    }
  };

  const handleUnitChange = (selectedItem, indexItem) => {
    const {serving_weight, qty} = foodData.alt_measures[indexItem - 1];
    console.log('serving_weight', serving_weight);
    const factor = serving_weight / foodData.realGrams;
    const realCalories = foodData.realCalories * factor;
    const realProtein = foodData.realProtein * factor;
    const realFat = foodData.realFat * factor;
    const realCarbo = foodData.realCarbo * factor;
    setFoodData({
      ...foodData,
      realUnit: selectedItem,
      realQty: qty,
      realGrams: serving_weight,
      realCalories,
      realProtein,
      realFat,
      realCarbo
    });
  };

  // check date is today or yesterday or other
  const checkDate = date => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const dateCheck = new Date(date);
    if (
      dateCheck.getDate() === today.getDate() &&
      dateCheck.getMonth() === today.getMonth() &&
      dateCheck.getFullYear() === today.getFullYear()
    ) {
      return 'Today';
    } else if (
      dateCheck.getDate() === yesterday.getDate() &&
      dateCheck.getMonth() === yesterday.getMonth() &&
      dateCheck.getFullYear() === yesterday.getFullYear()
    ) {
      return 'Yesterday';
    } else {
      console.log('dateCheck', dateCheck);
      return format(dateCheck, 'EEE, d/MM/yyyy');
    }
  };

  return (
    <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={true}>
      {isLoading ? null : (
        <View style={styles.container}>
          <View style={styles.inforContainer}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8
              }}>
              <Image
                source={{uri: foodData.photo.thumb}}
                style={{width: 50, height: 50}}
              />
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    gap: 10
                  }}>
                  <TextInput
                    style={styles.textInput}
                    keyboardType="numeric"
                    value={foodData.realQty.toString()}
                    onChangeText={text => handleQtyChange(text)}
                  />
                  <RNPickerSelect
                    items={getAltMeasures(foodData)}
                    style={{
                      inputAndroid: {
                        justifyContent: 'center',
                        width: 180,
                        fontSize: 16,
                        paddingHorizontal: 10,
                        paddingVertical: 8,
                        borderWidth: 5,
                        borderColor: 'purple',
                        borderRadius: 8,
                        backgroundColor: 'lightgrey',
                        color: 'black'
                      }
                    }}
                    value={foodData.realUnit}
                    onValueChange={(selectedItem, indexItem) =>
                      handleUnitChange(selectedItem, indexItem)
                    }
                  />
                </View>
                <Text style={styles.text}>{foodData.food_name}</Text>
              </View>
            </View>
            <View style={{justifyContent: 'flex-end'}}>
              <Text style={styles.text}>{foodData.realCalories}</Text>
              <Text>cal</Text>
            </View>
          </View>
          <TouchableOpacity
            style={[
              styles.inforContainer,
              {
                padding: 20,
                borderTopWidth: 1,
                borderBottomWidth: 1,
                borderColor: 'gray'
              }
            ]}>
            <View style={{flexDirection: 'row', gap: 5}}>
              <Text style={[styles.text, {fontWeight: 'bold'}]}>When:</Text>
              <Text style={styles.text}>
                {/* {checkDate(foodData.date)}, {foodData.mealName} */}
              </Text>
            </View>
            <FontAwesome name="pencil" size={20} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.inforContainer,
              {
                borderBottomWidth: 1,
                borderColor: 'gray'
              }
            ]}>
            <View style={{flexDirection: 'row', gap: 5}}>
              <FontAwesome
                name="camera"
                size={20}
                color="black"
                style={{
                  padding: 4
                }}
              />
              <Text style={[styles.text]}>Photo</Text>
              <AntDesign
                name="right"
                size={16}
                color="black"
                style={{
                  padding: 4
                }}
              />
            </View>
          </TouchableOpacity>
          <View style={styles.inforContainer}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                gap: 40,
                borderWidth: 1,
                borderRadius: 10,
                borderColor: 'gray',
                width: '48%',
                padding: 8,
                alignItems: 'center',
                justifyContent: 'flex-start',
                opacity: isButtonEnabled ? 1 : 0.5
              }}
              onPress={isButtonEnabled ? () => handleSave : null}>
              <Ionicons
                name="save"
                size={22}
                color="black"
                style={{
                  padding: 2
                }}
              />
              <Text style={styles.text}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                gap: 40,
                borderWidth: 1,
                borderRadius: 10,
                borderColor: 'gray',
                width: '48%',
                padding: 8,
                alignItems: 'center',
                justifyContent: 'flex-start'
              }}>
              <Ionicons
                name="trash"
                size={24}
                color="black"
                style={{
                  padding: 2
                }}
              />
              <Text style={styles.text}>Delete</Text>
            </TouchableOpacity>
          </View>
          <NutriFact foodMeal={foodData} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white'
  },
  inforContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    justifyContent: 'space-between'
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 5,
    width: 40,
    fontSize: 16,
    textAlign: 'center'
  },
  text: {
    fontSize: 18,
    color: 'black'
  }
});
