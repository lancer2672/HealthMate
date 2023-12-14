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
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
        <View style={{flex: 1}}>
          <DropDownCategory
            exercise={searchExercise}
            setExercise={setSearchExercise}></DropDownCategory>
        </View>
        <TouchableOpacity onPress={viewAll} style={{}}>
          <Text style={styles.viewAll}>View all</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        contentContainerStyle={{marginBottom: 20, marginTop: 4}}
        horizontal
        removeClippedSubviews={false}
        showsHorizontalScrollIndicator={false}
        onEndReachedThreshold={0.5}
        onEndReached={handleLoadMore}
        keyExtractor={(item, index) => `x3${index}`}
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
