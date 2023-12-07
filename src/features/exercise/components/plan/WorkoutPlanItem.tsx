import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import {PlanType} from 'src/types/plan.type';
import BottomMenu from './BottomMenu';
import {useDispatch, useSelector} from 'react-redux';
import {exerciseSelector} from 'src/store/selectors';
import {useNavigation} from '@react-navigation/native';
import {setSelectedPlan} from 'src/store/reducer/exerciseSlice';
import {useTheme} from 'styled-components';

const SCREEN_WIDTH = Dimensions.get('window').width;
type WorkoutItemProps = {
  planId: string,
  data: [
    {
      breakDuration: string,
      duration: string,
      exerciseId: string
    }
  ]
};
const WorkoutItem = ({planId, data}: WorkoutItemProps) => {
  const [plan, setPlan] = useState(null);
  const {plans} = useSelector(exerciseSelector);
  const navigation = useNavigation();
  const theme = useTheme();
  const dispatch = useDispatch();
  useEffect(() => {
    console.log('planId', planId, plans);
    setPlan(plans.find(p => p.id === planId));
  }, [planId]);
  const getPlanImage = () => {
    return data
      ? require('../../../../assets/imgs/success.png')
      : require('../../../../assets/imgs/plan.jpg');
  };
  console.log('WorkoutItem', plan);
  //   const openBottomMenu = () => {
  //     setIsShowMenu(true);
  //   };
  const handleStartPlanSession = () => {
    dispatch(setSelectedPlan(plan));
    navigation.navigate('StartPlan');
  };
  if (!plan) {
    return (
      <>
        <View style={styles.seperator}></View>
        <View style={styles.wraper}>
          <Image source={getPlanImage()} style={styles.createPlan}></Image>
          <View style={{flex: 1, marginLeft: 12}}>
            <Text style={[styles.planText]}>No plan set</Text>
          </View>
        </View>
      </>
    );
  }
  const getTotalDuration = () => {
    const res = data.reduce((acc, item) => {
      return acc + item.duration || 0;
    }, 0);
    return res;
  };
  const getTotalBreakDuration = () => {
    const res = data.reduce((acc, item) => {
      return acc + item.breakDuration;
    }, 0);
    return res;
  };
  return (
    <>
      <View style={styles.seperator}></View>

      <TouchableOpacity
        onPress={handleStartPlanSession}
        style={[
          styles.wraper,
          {backgroundColor: data ? theme.success : theme.secondary}
        ]}>
        <Image source={getPlanImage()} style={styles.createPlan}></Image>
        <View style={{flex: 1, marginLeft: 12}}>
          {data ? (
            <>
              <Text style={[styles.planText]}>
                {plan.planName} - {data.length} exericse
              </Text>
              <Text style={[styles.planSubText]}>
                {getTotalDuration()} seconds
              </Text>
            </>
          ) : (
            <>
              <Text style={[styles.planText]}>{plan.planName}</Text>
              <Text style={[styles.planSubText]}>
                {plan.exercise.length === 0
                  ? 'No exericse yet'
                  : `${plan.exercise.length} exercise`}
              </Text>
            </>
          )}
        </View>
        {/* <TouchableOpacity onPress={openBottomMenu} style={styles.moreIcon}>
        <Feather name={'more-vertical'} color={'black'} size={28}></Feather>
      </TouchableOpacity>
      <BottomMenu
        plan={plan}
        visible={isShowMenu}
        onClose={() => {
          setIsShowMenu(false);
        }}></BottomMenu> */}
      </TouchableOpacity>
    </>
  );
};

export default WorkoutItem;

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    marginBottom: 4
  },
  createPlan: {
    width: 40,
    height: 40,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'gray'
  },
  moreIcon: {
    padding: 4
  },
  planText: {
    fontSize: 18,

    fontWeight: 'bold'
  },
  wraper: {
    flexDirection: 'row',
    marginVertical: 6,
    minHeight: 80,
    paddingVertical: 8,
    flex: 1,
    // borderWidth: 1,
    paddingHorizontal: 8,
    borderColor: 'gray',
    borderRadius: 4,
    width: SCREEN_WIDTH - 30,
    alignItems: 'center'
  },
  seperator: {
    borderWidth: 1,
    width: SCREEN_WIDTH - 30,

    marginVertical: 6
  },
  planSubText: {
    fontSize: 14
  }
});
