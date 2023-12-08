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

const ListCommonFood = ({date, mealName, searchResults, navigation}) => {
  const commonResults = Array.from(
    new Set(searchResults.common?.map(item => item.tag_id) ?? [])
  ).map(tagId => searchResults.common.find(item => item.tag_id === tagId));

  const handleNavigateLogFood = item => {
    console.log('date', date);
    navigation.pop();
    navigation.navigate('LogFood', {
      data: {
        date: date,
        mealName: mealName,
        item: item,
        type: 'common'
      }
    });
  };

  return (
    <>
      {commonResults.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.itemContainer, styles.itemCommon]}
          onPress={() => {
            handleNavigateLogFood(item);
          }}>
          <Image
            source={{uri: item.photo.thumb}}
            style={{width: 50, height: 50}}
          />
          <View style={{flexDirection: 'column'}}>
            <Text style={styles.itemName}>{item.food_name}</Text>
            <Text>{item.serving_unit}</Text>
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
  itemCommon: {
    justifyContent: 'flex-start'
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black'
  }
});

export default ListCommonFood;
