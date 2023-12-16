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
// import {useAppDispatch, useAppSelector} from 'src/store/hooks';
// import {userSelector, foodMealSelector} from 'src/store/selectors';
// import {useSelector} from 'react-redux';

const FoodCard = ({mealName, foodMeal, navigation}) => {
  console.log('foodMeal17', foodMeal);

  const handleNavigateEditFood = foodMeal => {
    navigation.navigate('EditFood', {
      data: {
        mealName: mealName,
        foodMeal: foodMeal
      }
    });
  };
  return (
    <View style={styles.foodContainer}>
      <View style={styles.inforContainer}>
        <Image
          source={{uri: foodMeal.photo.thumb}}
          style={{width: 50, height: 50}}
        />
        <View>
          <Text
            style={[
              styles.text,
              {
                color: 'black'
              }
            ]}>
            {foodMeal.foodName}
          </Text>
          <Text>
            {foodMeal.realQty} {foodMeal.realUnit}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8
        }}
        onPress={() => handleNavigateEditFood(foodMeal)}>
        <Text
          style={[
            styles.text,
            {
              color: 'green'
            }
          ]}>
          {foodMeal.realCalories}
        </Text>
        <AntDesign name="right" size={16} color="gray"></AntDesign>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  foodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  inforContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default FoodCard;
