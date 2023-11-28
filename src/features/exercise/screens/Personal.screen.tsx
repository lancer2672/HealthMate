import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import ExerciseCardItemScreen from '../components/ExerciseCardItem';
import {ScrollView} from 'react-native';
import DropDownCategory from '../components/DropdownCategory';
import axiosClient from 'src/api/axiosClient';
import {EXERCISE_BASE_URL} from 'src/constants';
import RecommendedList from '../components/RecommendedList';

const Personal = () => {
  return (
    <ScrollView style={styles.container}>
      <RecommendedList></RecommendedList>
      <Text style={styles.title}>Recommended for you</Text>
      <FlatList
        contentContainerStyle={{marginBottom: 20}}
        horizontal
        removeClippedSubviews={false}
        showsHorizontalScrollIndicator={false}
        data={[1]}
        renderItem={({item}) => <ExerciseCardItemScreen exercise={item} />}
      />

      <FlatList
        contentContainerStyle={{marginBottom: 20}}
        horizontal
        removeClippedSubviews={false}
        showsHorizontalScrollIndicator={false}
        data={[1]}
        renderItem={({item}) => <ExerciseCardItemScreen exercise={item} />}
      />
    </ScrollView>
  );
};

export default Personal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    paddingTop: 0
  },
  title: {
    fontSize: 20,
    marginBottom: 4
  }
});
