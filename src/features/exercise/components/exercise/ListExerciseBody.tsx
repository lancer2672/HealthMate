import {useNavigation} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import exerciseApi from 'src/api/exerciseApi';
import DropDownCategory from '../DropdownCategory';
import ExerciseCardItem from './ExerciseCardItem';

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
    navigation.replace('ListExercise', {
      exercises: searchExercise
    });
  };

  const handleLoadMore = async () => {
    const list = await exerciseApi.getAll(searchExercise.length + 10);
    setSearchExercise(list);
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white', padding: 8}}>
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
        removeClippedSubviews={false}
        showsVerticalScrollIndicator={false}
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
