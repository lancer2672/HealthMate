import React, {useState, useEffect, useContext, useMemo, memo} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ImageBackground,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const {width} = Dimensions.get('screen');

const ExerciseCardItem = ({exercise}) => {
  return (
    <TouchableOpacity>
      <ImageBackground
        style={styles.rmCard}
        resizeMode="contain"
        source={{
          uri: exercise.gifUrl
        }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'flex-end'
          }}>
          <Text
            style={{
              color: 'black',
              fontSize: 20,
              fontWeight: 'bold'
            }}>
            {exercise.name}
          </Text>
          <View style={{position: 'absolute', top: 0, right: 0}}>
            <Text>Add</Text>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  rmCard: {
    width: width - 40,
    height: 180,
    marginRight: 20,
    borderRadius: 10,
    overflow: 'hidden',
    padding: 10
  }
});

export default memo(ExerciseCardItem);
