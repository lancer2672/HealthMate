import {useNavigation} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
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

  const navigateToSearchScreen = () => {
    navigation.navigate('ListExerciseBody');
  };
  useEffect(() => {
    (async () => {
      //   const list = await exerciseApi.getTargetList();
      //   setTargetList(list);
    })();
  }, []);

  return (
    <>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
        <Text style={styles.title}>Target exercise</Text>
        <TouchableOpacity onPress={navigateToSearchScreen} style={{padding: 4}}>
          <Feather name="search" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View>
        <FlatList
          contentContainerStyle={{marginBottom: 20, marginTop: 4}}
          horizontal
          showsHorizontalScrollIndicator={false}
          data={targetList}
          keyExtractor={(item, index) => `x1${index}`}
          renderItem={({item}) => <TargetExerciseItem target={item} />}
        />
      </View>
    </>
  );
};

export default ListTargetExercise;

const styles = StyleSheet.create({
  target: {
    color: 'gray',
    fontSize: 24
  },
  title: {
    fontSize: 20,
    marginVertical: 8,
    fontWeight: 'bold'
  }
});
