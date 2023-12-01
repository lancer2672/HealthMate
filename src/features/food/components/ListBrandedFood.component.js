import React, {useState} from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  Button,
  Image,
  StyleSheet,
  ScrollView
} from 'react-native';

const ListBrandedFood = ({date, mealName, searchResults}) => {
  console.log('date={currentDate}', date);
  return (
    <>
      {searchResults.branded?.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.itemContainer, styles.itemBranded]}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12
            }}>
            <Image
              source={{uri: item.photo.thumb}}
              style={{width: 50, height: 50}}
            />
            <View
              style={{
                display: 'flex',
                flexDirection: 'column',
                maxWidth: '80%'
              }}>
              <Text style={styles.itemName}>{item.food_name}</Text>
              <Text>1 {item.serving_unit}</Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'flex-end'
            }}>
            <Text style={{color: 'blue', fontWeight: 'bold'}}>
              {item.nf_calories}
            </Text>
            <Text>cal</Text>
          </View>
        </TouchableOpacity>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
    gap: 12
  },
  itemBranded: {
    justifyContent: 'space-between'
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black'
  }
});

export default ListBrandedFood;
