import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {SwipeListView} from 'react-native-swipe-list-view';
import RNPickerSelect from 'react-native-picker-select';

const FoodCard = ({data, onDelete, onUpdate}) => {
  const [listFood, setListFood] = useState([...data]);

  // useEffect(() => {
  //   console.log('listFood', listFood);
  //   // updatedFood(listFood);
  // }, [listFood]);

  const getAltMeasures = foodItem => {
    const data = foodItem.alt_measures.map(measureItem => ({
      label: measureItem.measure,
      value: measureItem.measure
    }));
    return data;
  };

  const calculateRealValues = (type, foodItem, servingWeight, qty) => {
    const {
      nf_calories,
      nf_protein,
      nf_total_fat,
      nf_total_carbohydrate,
      realUnit,
      serving_weight_grams
    } = foodItem;

    switch (type) {
      case 'qty': {
        const {realCalories, realProtein, realFat, realCarbo, realQty} =
          foodItem;
        const measure = foodItem.alt_measures.find(
          item => item.measure === realUnit
        ).serving_weight;
        const serving_weight = measure.serving_weight;
        const serv_qty = measure.qty;

        const factorReal = qty / realQty;
        const factorServing =
          (qty * serving_weight) / (serving_weight_grams * serv_qty);
        console.log('factorServing', factorServing);
        let calories, protein, fat, carbo;
        if (realCalories === 0) {
          calories = nf_calories * factorServing;
        } else {
          calories = realCalories * factorReal;
        }
        if (realProtein === 0) {
          protein = nf_protein * factorServing;
        } else {
          protein = realProtein * factorReal;
        }
        if (realFat === 0) {
          fat = nf_total_fat * factorServing;
        } else {
          fat = realFat * factorReal;
        }
        if (realCarbo === 0) {
          carbo = nf_total_carbohydrate * factorServing;
        } else {
          carbo = realCarbo * factorReal;
        }
        return {
          realCalories: Number(calories.toFixed(1)),
          realProtein: Number(protein.toFixed(1)),
          realFat: Number(fat.toFixed(1)),
          realCarbo: Number(carbo.toFixed(1))
        };
      }
      case 'unit': {
        const factor = servingWeight / foodItem.serving_weight_grams;

        return {
          realCalories: Number((nf_calories * factor).toFixed(1)),
          realProtein: Number((nf_protein * factor).toFixed(1)),
          realFat: Number((nf_total_fat * factor).toFixed(1)),
          realCarbo: Number((nf_total_carbohydrate * factor).toFixed(1))
        };
      }
    }
  };

  const handleQtyChange = (text, indexFood) => {
    const qty = parseFloat(text);
    const updateListFood = [...listFood];
    const realValues = calculateRealValues(
      'qty',
      listFood[indexFood],
      null,
      qty
    );
    updateListFood[indexFood].realQty = qty;
    updateListFood[indexFood] = {
      ...updateListFood[indexFood],
      ...realValues
    };
    console.log('updateListFood', updateListFood);
    updatedFood(updateListFood);
  };

  const handleUnitChange = async (selectedItem, indexItem, indexFood) => {
    const measure = selectedItem;
    indexItem = indexItem - 1;
    const {qty, serving_weight} = listFood[indexFood].alt_measures[indexItem];
    const updateListFood = [...listFood];
    updateListFood[indexFood].realQty = qty;
    updateListFood[indexFood].realUnit = measure;
    updateListFood[indexFood].realGrams = serving_weight;
    const realValues = calculateRealValues(
      'unit',
      listFood[indexFood],
      serving_weight
    );
    updateListFood[indexFood] = {...updateListFood[indexFood], ...realValues};
    updatedFood(updateListFood);
  };

  const updatedFood = updateListFood => {
    setListFood(updateListFood);
    onUpdate(updateListFood);
  };

  const onDeleteFood = indexFood => {
    const updateListFood = [...listFood];
    updateListFood.splice(indexFood, 1);
    updatedFood(updateListFood);
  };

  const renderItem = (rowData, rowMap) => {
    const food = rowData.item;
    const indexFood = rowData.index;

    return (
      <View style={styles.cardContainer}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8
          }}>
          <Image
            source={{uri: food.photo.thumb}}
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
                value={food.realQty.toString()}
                onChangeText={text => handleQtyChange(text, indexFood)}
                onSubmitEditing={() => {
                  handleQtyChange(food.realQty.toString(), indexFood);
                }}
              />
              <RNPickerSelect
                items={getAltMeasures(food)}
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
                value={food.realUnit}
                onValueChange={(selectedItem, indexItem) =>
                  handleUnitChange(selectedItem, indexItem, indexFood)
                }
              />
            </View>
            <Text style={{fontSize: 16, color: 'black'}}>{food.food_name}</Text>
          </View>
          <TouchableOpacity>
            <AntDesign name="infocirlce" size={18} color="black"></AntDesign>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'flex-end'
          }}>
          <Text style={{color: 'green', fontWeight: 'bold', fontSize: 16}}>
            {Number(food.realCalories.toFixed(1))}
          </Text>
          <Text>cal</Text>
        </View>
      </View>
    );
  };

  const renderHiddenItem = (rowData, rowMap) => {
    const food = rowData.item;
    const indexFood = rowData.index;
    return (
      <View style={styles.rowBack}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDeleteFood(indexFood)}>
          <Text style={{color: 'white'}}>
            <MaterialCommunityIcons name="delete" color="white" size={24} />
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SwipeListView
      data={listFood}
      renderItem={renderItem}
      renderHiddenItem={renderHiddenItem}
      rightOpenValue={-75}
      disableRightSwipe={true}
    />
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    backgroundColor: 'white'
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
  rowBack: {
    alignItems: 'center',
    backgroundColor: 'red',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
    marginTop: 10
  },
  deleteButton: {
    width: 75,
    height: '100%',
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default FoodCard;
