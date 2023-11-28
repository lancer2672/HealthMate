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
        source={{
          uri: 'https://picsum.photos/200/300'
        }}>
        <Text
          style={{
            color: 'black',
            fontSize: 20,
            fontWeight: 'bold',
            marginTop: 10
          }}>
          exercise name
        </Text>
        <View
          style={{
            flex: 1,
            justifyContent: 'space-between',
            alignItems: 'flex-end'
          }}>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              marginTop: 120,
              justifyContent: 'space-between'
            }}>
            <View style={{flexDirection: 'row'}}>
              <Ionicons name="person-circle-outline" size={20} color="white" />
              <Text style={{marginLeft: 5, color: 'white', fontSize: 17}}>
                type
              </Text>
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              {/* <Ionicons name="" size={20} color="white" /> */}
              <Text style={{marginLeft: 5, color: 'white', fontSize: 17}}>
                Nothing
              </Text>
            </View>
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
