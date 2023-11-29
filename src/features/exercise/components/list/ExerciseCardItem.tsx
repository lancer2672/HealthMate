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
import {Modal} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native';
import PlanListModal from '../plan/PlanListModal';
import {useNavigation} from '@react-navigation/native';
const {width} = Dimensions.get('screen');

const ExerciseCardItem = ({exercise}) => {
  const [isFavourite, setIsFavourite] = useState(false);
  const [isShowMenu, setIsShowMenu] = useState(false);
  const [isShowPlanList, setIsShowPlanList] = useState(false);
  const navigation = useNavigation();
  useEffect(() => {}, []);
  const toggleFavourite = () => {
    setIsFavourite(!isFavourite);
  };
  const openBottomMenu = () => {
    setIsShowMenu(true);
  };
  const navigateToDetailExercise = () => {
    navigation.navigate('DetailExercise', {
      exercise
    });
  };
  return (
    <TouchableOpacity onPress={navigateToDetailExercise}>
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
            <TouchableOpacity onPress={openBottomMenu}>
              <FontAwesome
                name={'plus'}
                color={'black'}
                size={28}></FontAwesome>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
      <PlanListModal
        visible={isShowPlanList}
        onClose={() => {
          setIsShowPlanList(false);
        }}></PlanListModal>

      <BottomMenu
        visible={isShowMenu}
        showPlanList={() => {
          setIsShowMenu(false);
          setIsShowPlanList(true);
        }}
        onClose={() => {
          setIsShowMenu(false);
        }}></BottomMenu>
    </TouchableOpacity>
  );
};

const BottomMenu = ({visible, onClose, showPlanList}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end'
          }}>
          <View
            style={{
              backgroundColor: 'black',
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              borderColor: 'white'
            }}>
            <View
              style={{
                height: 12,
                width: 100,
                alignSelf: 'center',
                borderBottomWidth: 2,
                marginBottom: 12
              }}></View>
            <TouchableOpacity
              style={[
                styles.optionContainer,
                {
                  width: '100%'
                }
              ]}
              onPress={showPlanList}>
              <Text style={styles.option}>Add to plan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
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
  },
  optionContainer: {
    borderColor: 'gray',
    borderTopWidth: 1,
    justifyContent: 'center',
    paddingVertical: 8,
    width: '100%'
  },
  option: {
    fontWeight: '500',
    textAlign: 'center',
    fontSize: 18,
    color: 'white'
  }
});

export default memo(ExerciseCardItem);
