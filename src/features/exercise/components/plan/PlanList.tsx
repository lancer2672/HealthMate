import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {FlatList} from 'react-native';
import ExerciseItem from '../ExerciseItem';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Searchbar, Snackbar} from 'react-native-paper';
import {useNavigation, useRoute} from '@react-navigation/native';
import ExerciseCardItem from './ExerciseCardItem';
import exerciseApi from 'src/api/exerciseApi';
import {useDispatch, useSelector} from 'react-redux';
import {exerciseSelector, userSelector} from 'src/store/selectors';
import PlanItem from '../PlanItem';
import {setSelectedPlan} from 'src/store/reducer/exerciseSlice';

const PlanList = () => {
  const route = useRoute<any>();
  const {user} = useSelector(userSelector);
  const {plans, workoutPlan} = useSelector(exerciseSelector);
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<any>();
  const viewDetailPlan = plan => {
    dispatch(setSelectedPlan(plan));
    navigation.navigate('DetailPlan');
  };
  return (
    <FlatList
      contentContainerStyle={{marginBottom: 20}}
      removeClippedSubviews={false}
      data={plans}
      renderItem={({item}) => (
        <Pressable onPress={() => viewDetailPlan(item)}>
          <PlanItem plan={item} />
        </Pressable>
      )}
    />
  );
};

export default PlanList;

const styles = StyleSheet.create({});
