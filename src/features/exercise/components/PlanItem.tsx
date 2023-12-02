import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import React, {useState} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import {PlanType} from 'src/types/plan.type';
import BottomMenu from './BottomMenu';

const SCREEN_WIDTH = Dimensions.get('window').width;
type PlanItemProps = {
  plan: PlanType,
  isSelected?: boolean
};
const PlanItem = ({plan, isSelected = false}: PlanItemProps) => {
  const [isShowMenu, setIsShowMenu] = useState(false);
  const getPlanImage = () => {
    return require('../../../assets/imgs/plan.jpg');
    if (plan.exercise.length == 0) {
    } else {
      return {uri: plan.exercise[0].gifUrl};
    }
  };
  console.log('PlanItem', plan);
  const openBottomMenu = () => {
    setIsShowMenu(true);
  };
  return (
    <View style={styles.wraper}>
      <Image source={getPlanImage()} style={styles.createPlan}></Image>
      <View style={{flex: 1, marginLeft: 12}}>
        <Text style={[styles.planText, {color: isSelected ? 'white' : null}]}>
          {plan.planName}
        </Text>
        <Text
          style={[styles.planSubText, {color: isSelected ? 'white' : null}]}>
          {plan.exercise.length === 0
            ? 'No exericse yet'
            : `${plan.exercise.length} exercise`}
        </Text>
      </View>
      <TouchableOpacity onPress={openBottomMenu} style={styles.moreIcon}>
        <Feather name={'more-vertical'} color={'black'} size={28}></Feather>
      </TouchableOpacity>
      <BottomMenu
        plan={plan}
        visible={isShowMenu}
        onClose={() => {
          setIsShowMenu(false);
        }}></BottomMenu>
    </View>
  );
};

export default PlanItem;

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    marginBottom: 4
  },
  createPlan: {
    width: 60,
    height: 60,
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
    paddingLeft: 6,
    flex: 1,

    width: SCREEN_WIDTH - 30,
    alignItems: 'center'
  },
  planSubText: {
    fontSize: 14
  }
});
