import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  FlatList,
  ScrollView
} from 'react-native';
import React, {useEffect, useState, useReducer} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import NutriFact from 'src/components/NutriFact';

export default function DetailNutriFood({route, navigation}) {
  const {food} = route.params.data;

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 10
        }}>
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
            <Text style={styles.text}>{food.food_name}</Text>
            <Text>
              {food.realQty} {food.realUnit}
            </Text>
          </View>
        </View>
        <View style={{alignItems: 'flex-end', justifyContent: 'center'}}>
          <Text style={{color: 'green', fontSize: 18}}>
            {food.realCalories}
          </Text>
          <Text>Cal</Text>
        </View>
      </View>
      <TouchableOpacity
        style={[
          styles.inforContainer,
          {
            borderTopWidth: 1,
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
      <NutriFact foodMeal={food} />
      <View style={{padding: 10, alignItems: 'center'}}>
        <TouchableOpacity
          style={{
            padding: 10,
            paddingLeft: 30,
            paddingRight: 30,
            backgroundColor: 'blue',
            borderRadius: 5
          }}
          onPress={() => handleBack()}>
          <Text
            style={{
              color: 'white',
              textAlign: 'center',
              fontSize: 16,
              fontWeight: 'bold'
            }}>
            Back
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  inforContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 15,
    justifyContent: 'space-between',
    marginBottom: 10
  },
  text: {
    fontSize: 18,
    color: 'black'
  }
});
