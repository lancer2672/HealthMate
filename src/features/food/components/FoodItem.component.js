import {useNavigation} from '@react-navigation/native';
import {useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';

import {useSelector} from 'react-redux';
import {exerciseSelector} from 'src/store/selectors';
import {convertSecondsToMinutesAndSeconds} from 'src/utils/dateTimeHelper';
import {useTheme} from 'styled-components';

export default function FoodItem({
  isSelected,
  move,
  exercise,
  index,
  onSelect
}) {
  const [isShowMenu, setIsShowMenu] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const {selectedPlan} = useSelector(exerciseSelector);
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const openMenu = () => {
    setIsShowMenu(true);
  };
  const navigateToDetailExercise = () => {
    navigation.navigate('DetailExercise', {
      exercise
    });
  };
  return (
    <>
      <TouchableOpacity
        onLongPress={() => {
          console.log('onLongPress', move);
          move();
        }}
        style={[
          {
            backgroundColor: 'gray'
          },
          styles.item
        ]}
        onPress={() => onSelect(index)}>
        <View style={[styles.circleNumber, {backgroundColor: theme.secondary}]}>
          <Text style={[styles.number]}>{index + 1}</Text>
        </View>
        <View
          style={{
            overflow: 'hidden',
            marginRight: 12,
            borderRadius: 12
          }}>
          <Image
            source={{uri: exercise.gifUrl}}
            resizeMode="cover"
            style={{
              width: 80,
              height: 80
            }}></Image>
        </View>

        <View style={styles.itemInfo}>
          <Text
            style={[
              styles.itemName,
              {
                color: 'white'
              }
            ]}>
            {exercise.name}
          </Text>
          <Text
            style={[
              styles.itemTime,
              {
                color: 'white'
              }
            ]}>
            {convertSecondsToMinutesAndSeconds(exercise.duration)}
          </Text>
        </View>
        <TouchableOpacity
          onPress={navigateToDetailExercise}
          style={styles.itemIcon}>
          <AntDesign name="questioncircleo" size={24} color={'white'} />
        </TouchableOpacity>
        {/* not allowed to modify recommended exercise */}
        {selectedPlan.isRecommendedPlan ? (
          <></>
        ) : (
          <TouchableOpacity onPress={openMenu}>
            <Feather name="more-vertical" size={24} color={'white'} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
      <BottomMenu
        exercise={exercise}
        visible={isShowMenu}
        openUpdateModal={() => {
          setUpdateModalVisible(true);
        }}
        onClose={() => {
          setIsShowMenu(false);
        }}></BottomMenu>
      <UpdateExerciseModal
        exercise={exercise}
        visible={updateModalVisible}
        onClose={() => {
          setUpdateModalVisible(false);
        }}></UpdateExerciseModal>
    </>
  );
}

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
