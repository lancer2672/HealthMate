import {StyleSheet, Text, FlatList, TouchableOpacity, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import axiosClient from 'src/api/axiosClient';
import {EXERCISE_BASE_URL} from 'src/constants';
import DropDownCategory from '../DropdownCategory';
import ExerciseCardItem from './ExerciseCardItem';
import {useNavigation} from '@react-navigation/native';
import exerciseApi from 'src/api/exerciseApi';

const ListExerciseBody = () => {
  const [searchExercise, setSearchExercise] = useState([]);

  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const list = await exerciseApi.getAll(searchExercise.length + 10);
      setSearchExercise(list);
    })();
  }, []);

  const viewAll = () => {
    navigation.navigate('ListExercise', {
      exercises: searchExercise
    });
  };
  const handleLoadMore = async () => {
    const list = await exerciseApi.getAll(searchExercise.length + 10);
    setSearchExercise(list);
  };

  return (
    <View>
      <DropDownCategory
        exercise={searchExercise}
        setExercise={setSearchExercise}></DropDownCategory>
      <TouchableOpacity onPress={viewAll} style={{alignSelf: 'flex-end'}}>
        <Text style={styles.viewAll}>View all</Text>
      </TouchableOpacity>
      <FlatList
        contentContainerStyle={{marginBottom: 20, marginTop: 4}}
        horizontal
        removeClippedSubviews={false}
        showsHorizontalScrollIndicator={false}
        onEndReachedThreshold={0.5}
        onEndReached={handleLoadMore}
        data={searchExercise}
        renderItem={({item}) => <ExerciseCardItem exercise={item} />}
      />
    </View>
  );
};

export default ListExerciseBody;

const styles = StyleSheet.create({
  viewAll: {
    color: 'gray'
  }
});
