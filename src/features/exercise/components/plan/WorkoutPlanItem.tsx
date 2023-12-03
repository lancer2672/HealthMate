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
import {useSelector} from 'react-redux';
import {exerciseSelector} from 'src/store/selectors';
import {useNavigation} from '@react-navigation/native';

const SCREEN_WIDTH = Dimensions.get('window').width;
type WorkoutItemProps = {
  planId: string
};
const WorkoutItem = ({planId}: WorkoutItemProps) => {
  const [plan, setPlan] = useState(null);
  const {plans} = useSelector(exerciseSelector);
  const navigation = useNavigation();
  useEffect(() => {
    console.log('planId', planId, plans);
    setPlan(plans.find(p => p.id === planId));
  }, [planId]);
  const getPlanImage = () => {
    return require('../../../../assets/imgs/plan.jpg');
    if (plan.exercise.length == 0) {
    } else {
      return {uri: plan.exercise[0].gifUrl};
    }
  };
  console.log('WorkoutItem', plan);
  //   const openBottomMenu = () => {
  //     setIsShowMenu(true);
  //   };
  const handleStartPlanSession = () => {
    navigation.navigate('StartPlan', {planId});
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
  return (
    <>
      <View style={styles.seperator}></View>

      <TouchableOpacity onPress={handleStartPlanSession} style={styles.wraper}>
        <Image source={getPlanImage()} style={styles.createPlan}></Image>
        <View style={{flex: 1, marginLeft: 12}}>
          <Text style={[styles.planText]}>{plan.planName}</Text>
          <Text style={[styles.planSubText]}>
            {plan.exercise.length === 0
              ? 'No exericse yet'
              : `${plan.exercise.length} exercise`}
          </Text>
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
    height: 60,
    flex: 1,
    borderWidth: 1,
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
