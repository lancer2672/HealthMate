import {View, Text, TouchableOpacity, StyleSheet, FlatList} from 'react-native';
import React, {useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';

const ListFood = ({mealName, foodMeal, handleNavigateSeacrch}) => {
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
          <Text style={styles.mealName}>0</Text>
        </View>
      </View>
      <TouchableOpacity
        style={{
          padding: 5,
          paddingLeft: 10,
          paddingRight: 10
        }}>
        {foodMeal.length > 0 ? <></> : <Text>No foods logged yet</Text>}
      </TouchableOpacity>
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
