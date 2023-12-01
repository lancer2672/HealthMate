import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {FlatList} from 'react-native';
import ExerciseItem from '../ExerciseItem';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Searchbar, Snackbar} from 'react-native-paper';
import {useNavigation, useRoute} from '@react-navigation/native';
import ExerciseCardItem from './ExerciseCardItem';
import exerciseApi from 'src/api/exerciseApi';

const ListExercise = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const {exercises, type, value} = route.params;
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [isSearching, setIsSearching] = useState(true);
  const [listExercise, setListExercise] = useState(exercises);
  const searchTimeout = useRef<any>();
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [isTyping, setIstyping] = useState(true);

  console.log('ex', listExercise);
  const loadMore = async () => {
    let list = [];
    switch (type) {
      case 'target':
        list = await exerciseApi.getTargetExercise(
          value,
          listExercise.length + 10
        );
        break;
      default:
        list = await exerciseApi.getAll(listExercise.length + 10);
    }

    setListExercise(list);
  };
  const searchExerciseByName = () => {
    const searchResult = exercises.filter(ex =>
      ex.name.toLowerCase().includes(searchKeyword.toLowerCase())
    );
    setListExercise(searchResult);
  };
  const navigateBack = () => {
    navigation.goBack();
  };
  useEffect(() => {
    if (searchKeyword.trim() == '') {
      setListExercise(exercises);
    } else {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
      searchTimeout.current = setTimeout(() => {
        searchExerciseByName();
      }, 400);
    }
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [searchKeyword]);
  return (
    <View style={styles.container}>
      <View style={{paddingBottom: 5, marginBottom: 12}}>
        <View style={styles.header}>
          <TouchableOpacity onPress={navigateBack}>
            <Ionicons name="arrow-back" size={28} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>List exercise</Text>
        </View>
      </View>
      <Searchbar
        autoFocus={false}
        icon={'account-search'}
        placeholder="Search"
        value={searchKeyword}
        onIconPress={() => console.log('press')}
        onChangeText={setSearchKeyword}
        iconColor={'#bdafaf'}
      />
      <Snackbar
        visible={snackbarVisible}
        duration={1000}
        onDismiss={() => setSnackbarVisible(false)}
        style={{
          backgroundColor: '#e3d8d8',
          position: 'absolute',
          top: 0,
          right: -16,
          left: 0,
          zIndex: 1
        }}>
        <View>
          <Text>Not found</Text>
        </View>
      </Snackbar>
      <FlatList
        style={{padding: 8}}
        contentContainerStyle={{marginTop: 20}}
        removeClippedSubviews={false}
        data={listExercise}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        renderItem={({item}) => <ExerciseCardItem exercise={item} />}
      />
    </View>
  );
};

export default ListExercise;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: 'white'},
  title: {
    fontSize: 32,
    fontWeight: '500',
    marginLeft: 12,
    color: 'black'
  },
  header: {
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12
  }
});
