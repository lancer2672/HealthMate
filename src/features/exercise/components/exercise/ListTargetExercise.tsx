import {StyleSheet, Text, FlatList, TouchableOpacity, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import exerciseApi from 'src/api/exerciseApi';
import TargetExerciseItem from './TargetExerciseItem';

const data = [
  {
    name: 'pectorals',
    imageUrl: require('../../../../assets/imgs/pectorals.jpg')
  },
  {
    name: 'biceps',
    imageUrl: require('../../../../assets/imgs/bicep.jpg')
  },
  {
    name: 'forearms',
    imageUrl: require('../../../../assets/imgs/forearm.jpg')
  },
  {
    name: 'calves',
    imageUrl: require('../../../../assets/imgs/calve.jpg')
  },
  {
    name: 'quads',
    imageUrl: require('../../../../assets/imgs/quads.jpg')
  }
];
const ListTargetExercise = () => {
  const [targetList, setTargetList] = useState(data);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      //   const list = await exerciseApi.getTargetList();
      //   setTargetList(list);
    })();
  }, []);

  return (
    <View>
      <Text style={styles.target}>Target exercise</Text>
      <FlatList
        contentContainerStyle={{marginBottom: 20, marginTop: 4}}
        horizontal
        showsHorizontalScrollIndicator={false}
        data={targetList}
        keyExtractor={(item, index) => `x1${index}`}
        renderItem={({item}) => <TargetExerciseItem target={item} />}
      />
    </View>
  );
};

export default ListTargetExercise;

const styles = StyleSheet.create({
  target: {
    color: 'gray',
    fontSize: 24
  }
});
