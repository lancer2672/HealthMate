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
  plan: PlanType
};
const PlanItem = ({plan}: PlanItemProps) => {
  const [isShowMenu, setIsShowMenu] = useState(false);

  const getPlanImage = () => {
    if (plan.exercise.length == 0) {
      return require('../../../assets/imgs/plan.jpg');
    } else {
      return {uri: plan.exercise[0].gifs};
    }
  };
  const openBottomMenu = () => {
    setIsShowMenu(true);
  };
  return (
    <View style={styles.wraper}>
      <Image source={getPlanImage()} style={styles.createPlan}></Image>
      <View style={{flex: 1, marginLeft: 12}}>
        <Text style={styles.planText}>{plan.name}</Text>
        <Text style={styles.planSubText}>
          {plan.exercise.length === 0
            ? 'No exericse yet'
            : `${plan.exercise.length} exercise`}
        </Text>
      </View>
      <TouchableOpacity onPress={openBottomMenu} style={styles.moreIcon}>
        <Feather name={'more-vertical'} color={'black'} size={28}></Feather>
      </TouchableOpacity>
      <BottomMenu
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
