import {Image, StyleSheet, TouchableOpacity, Text, View} from 'react-native';
import React from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const DetailExercise = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();

  const {exercise} = route.params;
  const navigateBack = () => {
    navigation.goBack();
  };
  return (
    <>
      <View style={{paddingBottom: 2}}>
        <View style={styles.header}>
          <TouchableOpacity onPress={navigateBack}>
            <Ionicons name="arrow-back" size={28} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>List exercise</Text>
        </View>
      </View>
      <View style={styles.container}>
        <Text style={styles.name}>{exercise.name}</Text>
        <Image source={{uri: exercise.gifUrl}} style={styles.img}></Image>
        <View>
          {exercise.instructions.map((instruction, i) => {
            return (
              <Text style={styles.instruction}>
                {i} - {instruction}
              </Text>
            );
          })}
        </View>
      </View>
    </>
  );
};

export default DetailExercise;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',

    padding: 12
  },
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
    // width: '100%',
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold'
  },
  img: {width: 100, height: 100},
  instruction: {
    marginTop: 4,
    fontSize: 15
  }
});
