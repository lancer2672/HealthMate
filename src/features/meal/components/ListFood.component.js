import {View, Text, TouchableOpacity, StyleSheet, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FoodCard from './FoodCard.component';

const ListFood = ({mealName, foodMeal, handleNavigateSeacrch, navigation}) => {
  const [totalCalories, setTotalCalories] = useState(0);

  const getTotalCalories = () => {
    let total = 0;
    foodMeal.forEach(item => {
      total += item.realCalories;
    });
    setTotalCalories(total);
  };

  useEffect(() => {
    getTotalCalories();
  });

  return (
    <View style={styles.mealContainer}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          borderBottomWidth: 1,
          borderColor: 'gray',
          padding: 5,
          paddingLeft: 10,
          paddingRight: 10,
          backgroundColor: '#e8e6e6'
        }}>
        <View
          style={{
            flexDirection: 'row'
          }}>
          <Text style={styles.mealName}>{mealName}</Text>
          <TouchableOpacity
            style={{padding: 3}}
            onPress={handleNavigateSeacrch}>
            <AntDesign name="pluscircle" size={16} color="green"></AntDesign>
          </TouchableOpacity>
        </View>
        <View>
          <Text style={styles.mealName}>{totalCalories.toFixed(1)}</Text>
        </View>
      </View>
      <View
        style={{
          padding: 5,
          paddingLeft: 10,
          paddingRight: 10
        }}>
        {foodMeal.length > 0 ? (
          <View>
            {/* <FlatList
              data={foodMeal}
              renderItem={({item}) => <FoodCard foodMeal={item} />}
              keyExtractor={item => item.id}
            /> */}
            {foodMeal.map(item => (
              <FoodCard
                key={item.id}
                mealName={mealName}
                foodMeal={item}
                navigation={navigation}
              />
            ))}
          </View>
        ) : (
          <Text>No foods logged yet</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mealContainer: {
    flexDirection: 'column',
    paddingBottom: 10
    // margin: 10,
    // borderBottomWidth: 1,
    // borderColor: 'blue'
  },
  mealName: {
    textTransform: 'uppercase',
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black'
  }
});

export default ListFood;
