import React, {useState, useEffect, useContext, useMemo, memo} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ImageBackground,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import exerciseApi from 'src/api/exerciseApi';

const {width} = Dimensions.get('screen');

const TargetExerciseItem = ({target}) => {
  const [listExercise, setListExercise] = useState([]);
  const navigation = useNavigation();
  useEffect(() => {}, []);

  const openList = () => {
    navigation.navigate('ListExercise', {
      exercises: listExercise,
      type: 'target',
      value: target.name
    });
  };

  const getListExerciseByTarget = async () => {
    const list = await exerciseApi.getTargetExercise(target.name);
    setListExercise(list);
  };

  useEffect(() => {
    getListExerciseByTarget();
  }, []);
  return (
    <TouchableOpacity onPress={openList}>
      <ImageBackground
        style={styles.rmCard}
        resizeMode="cover"
        source={target.imageUrl}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'flex-end'
          }}>
          <Text
            style={{
              color: 'white',
              fontSize: 20,
              fontWeight: 'bold'
            }}>
            {`${target.name}`}
          </Text>
          <View
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              flexDirection: 'row'
            }}>
            {/* <TouchableOpacity
              style={{marginRight: 12}}
              onPress={toggleFavourite}>
              <AntDesign
                name={isFavourite ? 'star' : 'staro'}
                color={isFavourite ? 'tomato' : 'black'}
                size={28}></AntDesign>
            </TouchableOpacity> */}
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  rmCard: {
    width: width - 40,
    height: 140,
    marginRight: 20,
    borderRadius: 10,
    overflow: 'hidden',
    padding: 10
  }
});

export default TargetExerciseItem;
