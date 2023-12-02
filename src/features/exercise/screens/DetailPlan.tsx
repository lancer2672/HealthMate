import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Text,
  View
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import {Modal} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native';
import {exerciseSelector, userSelector} from 'src/store/selectors';
import {useDispatch, useSelector} from 'react-redux';
import {removeExerciseAction} from 'src/store/reducer/thunks/exerciseActions';
import {useTheme} from 'styled-components';
import {Button} from 'react-native-paper';
import buttonStyles from 'src/features/theme/styles/button';
import {convertSecondsToMinutesAndSeconds} from 'src/utils/dateTimeHelper';
const DetailPlan = () => {
  const [selectedIndex, setSelectedIndex] = useState();

  const {user} = useSelector(userSelector);
  const {selectedPlan, plans} = useSelector(exerciseSelector);
  // const [exercise, setListExercise] = useState(selectedPlan.exercise);
  console.log('detail plan', selectedPlan);
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
    if (selectedPlan.exercise.length == 0) {
      return require('../../../assets/imgs/plan.jpg');
    } else {
      return {uri: selectedPlan.exercise[0].gifUrl};
    }
  };

  useEffect(() => {
    if (selectedPlan) {
      // setListExercise(selectedPlan.exercise);
      if (selectedPlan.exercise.length > 0) {
        setSelectedIndex(0);
      }
    }
  }, [selectedPlan]);
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View style={{paddingBottom: 2}}>
        <View style={[styles.header, {backgroundColor: theme.secondary}]}>
          <TouchableOpacity onPress={navigateBack}>
            <Ionicons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>

          <Text style={styles.title}>{selectedPlan.planName}</Text>
        </View>
      </View>
      <View style={styles.container}>
        <TouchableOpacity
          style={{
            padding: 4,
            alignSelf: 'flex-end',
            margin: 12,
            marginBottom: 0
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
          <FlatList
            data={selectedPlan.exercise}
            renderItem={({item, index}) => (
              <DetailPlanItem
                isSelected={selectedIndex === index}
                onSelect={onSelect}
                index={index}
                exercise={item}></DetailPlanItem>
            )}
            keyExtractor={item => `${item.name}plan-tiem`}
          />
          <Button
            style={[
              buttonStyles.primary,
              {
                width: 200,
                alignSelf: 'center'
              }
            ]}
            mode="contained"
            onPress={startPlan}>
            Start
          </Button>
        </View>
      </View>
    </View>
  );
};

const DetailPlanItem = ({isSelected, exercise, index, onSelect}) => {
  const [isShowMenu, setIsShowMenu] = useState(false);
  const theme = useTheme();

  const openMenu = () => {
    setIsShowMenu(true);
  };
  return (
    <>
      <TouchableOpacity
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
        <TouchableOpacity style={styles.itemIcon}>
          <AntDesign
            name="questioncircleo"
            size={24}
            color={isSelected ? 'white' : 'gray'}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={openMenu}>
          <Feather
            name="more-vertical"
            size={24}
            color={isSelected ? 'white' : 'gray'}
          />
        </TouchableOpacity>
      </TouchableOpacity>
      <BottomMenu
        exercise={exercise}
        visible={isShowMenu}
        onClose={() => {
          setIsShowMenu(false);
        }}></BottomMenu>
    </>
  );
};

const BottomMenu = ({visible, onClose, exercise}) => {
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
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default DetailPlan;

const styles = StyleSheet.create({
  container: {
    flex: 1
    // alignItems: 'center'
  },
  modalHeading: {
    textAlign: 'center',
    fontSize: 32,
    fontWeight: 'bold',
    paddingVertical: 4
  },
  img: {
    marginVertical: 12,
    width: 160,
    height: 160,
    alignSelf: 'center'
  },
  title: {
    fontSize: 32,
    fontWeight: '500',
    marginLeft: 12,

    color: 'white'
  },
  modalListEx: {
    flex: 1,
    borderRadius: 1,
    elevation: 1,
    margin: 12
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
