import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Text,
  View,
  TouchableWithoutFeedback,
  Modal
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import DraggableFlatList, {
  NestableScrollContainer,
  NestableDraggableFlatList
} from 'react-native-draggable-flatlist';
import {Modal as PaperModal, Portal} from 'react-native-paper';

import {exerciseSelector, userSelector} from 'src/store/selectors';
import {useDispatch, useSelector} from 'react-redux';
import {
  removeExerciseAction,
  updateExerciseAction,
  updatePlanExerciseAction
} from 'src/store/reducer/thunks/exerciseActions';
import {useTheme} from 'styled-components';
import {Button} from 'react-native-paper';
import buttonStyles from 'src/features/theme/styles/button';
import {convertSecondsToMinutesAndSeconds} from 'src/utils/dateTimeHelper';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {setCurrentExercise} from 'src/store/reducer/exerciseSlice';
import InputText from 'src/components/TextInput';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {DISABLE_MUSIC} from 'src/constants';
const DetailPlan = () => {
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
  const handleOnDragEnd = ({data, from, to}) => {
    console.log('on drag end data', from, to);
    const newList = [...listExercise];
    [newList[from], newList[to]] = [newList[to], newList[from]];
    dispatch(
      updateExerciseAction({
        userId: user.uid,
        id: selectedPlan.id,
        newExerciseList: newList
      })
    );
    setListExercise(newList);
  };
  console.log('selectedPlan', selectedPlan);
  const navigateToSelectMusicScreen = async () => {
    if (selectedPlan.exercise.length > 0) {
      const isHideScreen = await AsyncStorage.getItem(DISABLE_MUSIC);

      dispatch(setCurrentExercise({...selectedPlan.exercise[0], index: 0}));
      if (isHideScreen) {
        navigation.navigate('ReadyExercise');
      } else {
        navigation.navigate('SelectMusic');
      }
    }
  };
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
              <DraggableFlatList
                data={listExercise}
                onDragEnd={handleOnDragEnd}
                renderItem={({item, getIndex, drag, isActive}) => (
                  <View style={{width: '100%', paddingTop: 8}}>
                    <DetailPlanItem
                      move={drag}
                      isSelected={selectedIndex === getIndex()}
                      onSelect={onSelect}
                      index={getIndex()}
                      exercise={item}></DetailPlanItem>
                    <View style={styles.itemSeparator}></View>
                  </View>
                )}
                keyExtractor={item => `${item.name}plan-tiem`}
              />
            </View>

            <Button
              style={[
                buttonStyles.primary,
                {
                  width: 200,
                  alignSelf: 'center'
                }
              ]}
              mode="contained"
              onPress={navigateToSelectMusicScreen}>
              Start
            </Button>
          </View>
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

export const DetailPlanItem = ({
  isSelected,
  move,
  exercise,
  index,
  onSelect
}) => {
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
            backgroundColor: isSelected ? 'gray' : 'white'
          },
          styles.item
        ]}
        onPress={() => onSelect(index)}>
        <View
          style={[
            styles.circleNumber,
            {backgroundColor: isSelected ? theme.secondary : 'gray'}
          ]}>
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
                color: isSelected ? 'white' : 'gray'
              }
            ]}>
            {exercise.name}
          </Text>
          <Text
            style={[
              styles.itemTime,
              {
                color: isSelected ? 'white' : 'gray'
              }
            ]}>
            {convertSecondsToMinutesAndSeconds(exercise.duration)}
          </Text>
        </View>
        <TouchableOpacity
          onPress={navigateToDetailExercise}
          style={styles.itemIcon}>
          <AntDesign
            name="questioncircleo"
            size={24}
            color={isSelected ? 'white' : 'gray'}
          />
        </TouchableOpacity>
        {/* not allowed to modify recommended exercise */}
        {selectedPlan.isRecommendedPlan ? (
          <></>
        ) : (
          <TouchableOpacity onPress={openMenu}>
            <Feather
              name="more-vertical"
              size={24}
              color={isSelected ? 'white' : 'gray'}
            />
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
};

const BottomMenu = ({visible, onClose, openUpdateModal, exercise}) => {
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const {user} = useSelector(userSelector);
  const {selectedPlan} = useSelector(exerciseSelector);
  const dispatch = useDispatch();
  const removeExercise = () => {
    dispatch(
      removeExerciseAction({
        userId: user.uid,
        planName: selectedPlan.planName,
        exerciseName: exercise.name
      })
    );
    onClose();
  };
  const handleOpenUpdateModal = () => {
    onClose();
    openUpdateModal();
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalContainer}>
          <View style={styles.menuContainer}>
            <View style={styles.separator}></View>
            <TouchableOpacity
              style={styles.optionContainer}
              onPress={removeExercise}>
              <Text style={styles.option}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionContainer}
              onPress={handleOpenUpdateModal}>
              <Text style={styles.option}>Update</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const UpdateExerciseModal = ({visible, onClose, exercise}) => {
  const [breakDuration, setBreakDuration] = useState(-1);
  const [duration, setDuration] = useState(-1);
  const {selectedPlan} = useSelector(exerciseSelector);
  const {user} = useSelector(userSelector);
  const dispatch = useDispatch<any>();
  const handleUpdatePlanExercise = () => {
    if (breakDuration === -1 || duration === -1) return;

    const newExercise = {
      ...exercise,
      breakDuration,
      duration
    };
    dispatch(
      updatePlanExerciseAction({
        userId: user.uid,
        id: selectedPlan.id,
        exercise: newExercise
      })
    );
  };
  const handleClose = () => {
    onClose();
    resetForm();
  };
  const resetForm = () => {
    setBreakDuration(-1);
    setDuration(-1);
  };
  return (
    <Portal>
      <PaperModal visible={visible} onDismiss={handleClose}>
        <View style={styles.subModalContainer}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: '100%',
              paddingRight: 12,
              justifyContent: 'space-between'
            }}>
            <Text style={styles.modalHeading}>Update exericse</Text>
            <TouchableOpacity onPress={onClose}>
              <AntDesign name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <View style={{width: '100%', paddingHorizontal: 12}}>
            <InputText
              style={{width: '100%'}}
              keyboardType="numeric"
              onChangeText={setDuration}
              placeholder="Duration"
              value={duration}></InputText>
            <InputText
              style={{width: '100%'}}
              keyboardType="numeric"
              onChangeText={setBreakDuration}
              placeholder="Break duration"
              value={breakDuration}></InputText>
          </View>
          <Button
            style={[
              buttonStyles.primary,
              {alignSelf: 'flex-end', marginRight: 12}
            ]}
            mode="contained"
            onPress={handleUpdatePlanExercise}>
            Update
          </Button>
        </View>
      </PaperModal>
    </Portal>
  );
};
export default DetailPlan;

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
