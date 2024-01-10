import {useNavigation} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {useDispatch, useSelector} from 'react-redux';
import {exerciseSelector, userSelector} from 'src/store/selectors';
import {useTheme} from 'styled-components';
import FoodItem from '../components/FoodItem.component';
const CustomFood = () => {
  const [selectedIndex, setSelectedIndex] = useState();

  const {user} = useSelector(userSelector);
  const dispatch = useDispatch<any>();
  const {selectedPlan, plans} = useSelector(exerciseSelector);
  const [listExercise, setListExercise] = useState([]);
  // const [exercise, setListExercise] = useState(selectedPlan.exercise);
  const navigation = useNavigation();
  const theme = useTheme();
  const navigateBack = () => {
    navigation.goBack();
  };
  const onSelect = i => {
    setSelectedIndex(i);
  };
  const startPlan = () => {};
  const navigateToListEx = () => {
    navigation.navigate('ListExercise', {});
  };
  const getPlanImage = () => {
    return require('../../../../assets/imgs/bicep.jpg');
    if (selectedPlan.exercise.length == 0) {
    } else {
      // return {uri: selectedPlan.exercise[0].gifUrl};
    }
  };

  console.log('selectedPlan', selectedPlan);

  useEffect(() => {
    if (selectedPlan) {
      //not necessary
      const list = selectedPlan.exercise.map((e, i) => {
        return {
          ...e
        };
      });
      setListExercise(list);
    }
  }, [selectedPlan]);
  useEffect(() => {
    if (selectedPlan) {
      // setListExercise(selectedPlan.exercise);
      if (selectedPlan.exercise.length > 0) {
        setSelectedIndex(0);
      }
    }
  }, [selectedPlan]);
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <View style={{paddingBottom: 2}}>
          <View style={[styles.header, {backgroundColor: theme.secondary}]}>
            <TouchableOpacity onPress={navigateBack}>
              <Ionicons name="arrow-back" size={28} color="white" />
            </TouchableOpacity>

            <Text style={styles.title}>Plan</Text>
          </View>
        </View>
        <View style={styles.container}>
          <TouchableOpacity
            style={{
              padding: 4,
              alignSelf: 'flex-end',
              position: 'absolute',
              top: 12,
              right: 12
            }}
            onPress={navigateToListEx}>
            <FontAwesome name={'plus'} color={'black'} size={28}></FontAwesome>
          </TouchableOpacity>
          <Image source={getPlanImage()} style={styles.img}></Image>

          <View style={[{backgroundColor: null}, styles.modalListEx]}>
            <Text style={styles.modalHeading}>
              {selectedPlan.exercise.length === 0
                ? 'No exericse yet'
                : `${selectedPlan.exercise.length} exercise`}
            </Text>
            <View style={{flex: 1}}>
              <FlatList
                data={listExercise}
                renderItem={({item, getIndex, drag, isActive}) => (
                  <View style={{width: '100%', paddingTop: 8}}>
                    <FoodItem
                      isSelected={selectedIndex === getIndex()}
                      onSelect={onSelect}
                      index={getIndex()}
                      exercise={item}></FoodItem>
                    <View style={styles.itemSeparator}></View>
                  </View>
                )}
                keyExtractor={(item, i) => `i${i}`}
              />
            </View>
          </View>
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

export default CustomFood;

const styles = StyleSheet.create({
  container: {
    flex: 1
    // alignItems: 'center'
  },
  modalHeading: {
    textAlign: 'left',
    marginLeft: 12,
    fontSize: 28,
    fontWeight: 'bold',
    paddingVertical: 4,
    color: 'black'
  },
  itemSeparator: {
    width: '100%',
    borderWidth: 1
  },
  img: {
    width: '100%',
    height: 140,
    alignSelf: 'center'
  },
  title: {
    fontSize: 32,
    fontWeight: '500',
    marginLeft: 12,

    color: 'white'
  },

  subModalContainer: {
    backgroundColor: 'white',
    borderColor: 'gray',
    borderWidth: 1,
    elevation: 2,
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 'auto',
    marginHorizontal: 12,
    borderRadius: 4
  },
  modalListEx: {
    flex: 1,
    borderRadius: 1,
    elevation: 1
    // marginBottom: 12
  },
  header: {
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12
    // width: '100%',
  },

  //item
  circleNumber: {
    width: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    height: 28,
    marginRight: 12
  },
  number: {
    color: 'white'
  },
  itemInfo: {flex: 1},
  itemName: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  itemTime: {},
  itemIcon: {
    marginLeft: 8,
    padding: 4
  },
  item: {
    padding: 8,
    paddingVertical: 16,
    // borderRadius: 4,
    flexDirection: 'row',
    // marginHorizontal: 12,
    marginHorizontal: 4,
    marginTop: 4,
    marginBottom: 12,
    alignItems: 'center'
  },

  //modal
  optionContainer: {
    borderColor: 'gray',
    borderTopWidth: 1,
    justifyContent: 'center',
    paddingVertical: 8,
    width: '100%'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  menuContainer: {
    backgroundColor: 'black',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderColor: 'white'
  },
  separator: {
    height: 12,
    width: 100,
    alignSelf: 'center',
    borderBottomWidth: 2,
    marginBottom: 12
  },

  option: {
    fontWeight: '500',
    textAlign: 'center',
    fontSize: 18,
    color: 'white'
  }
});
