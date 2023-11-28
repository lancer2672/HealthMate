import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import ExerciseCardItemScreen from '../components/ExerciseCardItem';
import {ScrollView} from 'react-native';

const Personal = () => {
  return (
    <ScrollView style={styles.container}>
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
    marginBottom: 4,
    marginTop: 12
  }
});
