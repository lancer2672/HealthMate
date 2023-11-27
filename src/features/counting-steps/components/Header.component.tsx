import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  View
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from 'styled-components';

import Dialog from 'src/components/Dialog';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {DEFAULT_STEP_GOAL} from 'src/constants';
import {useDispatch, useSelector} from 'react-redux';
import {activitySelector, userSelector} from 'src/store/selectors';
import {updateUserActivityAction} from 'src/store/reducer/thunks/activityActions';
import {useAppDispatch, useAppSelector} from 'src/store/hooks';
import moment from 'moment';
import DatePicker from 'react-native-date-picker';

const Header = ({selectedDate, openDatePicker}) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const {user} = useAppSelector(userSelector);
  const [isModalVisible, setModalVisible] = useState(false);

  const setTarget = async (target: number) => {
    if (target >= 0) {
      dispatch(
        updateUserActivityAction({
          userId: user.uid,
          field: 'stepTarget',
          value: target
        })
      );
      await AsyncStorage.setItem(DEFAULT_STEP_GOAL, JSON.stringify(target));
    }
  };
  const formattedDate = moment(selectedDate).format('dddd, D MMM YYYY');
  return (
    <View style={[styles.container, {backgroundColor: theme.background}]}>
      <TouchableOpacity
        style={{paddingHorizontal: 4, alignSelf: 'flex-end'}}
        onPress={openDatePicker}>
        <Text style={styles.date}>{formattedDate}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{paddingHorizontal: 4, alignSelf: 'flex-end'}}
        onPress={() => setModalVisible(true)}>
        <MaterialCommunityIcons name="shoe-sneaker" size={30} color="white" />
      </TouchableOpacity>
      <Dialog
        onClick={setTarget}
        title={'Set target'}
        buttonContent={'Done'}
        onClose={() => setModalVisible(false)}
        isVisible={isModalVisible}></Dialog>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 24,
    justifyContent: 'space-between'
  },
  date: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white'
  }
});
