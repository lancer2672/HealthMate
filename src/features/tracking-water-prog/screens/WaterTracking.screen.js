import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {Title, Text, Button, Chip, Snackbar, Portal} from 'react-native-paper';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import ChangeTargetDialog from '../components/ChangeTargetDialog';
import valuesToPercentage, {today} from '../utils';
import {firebaseDatabase} from '../../../services/firebase';
import CustomWaterDialog from '../components/CustomWaterDialog';
import {
  addSession,
  getDateProgress,
  setDrinkGoal,
} from '../../../store/reducer/thunks/waterTrackingActions';
import {useDispatch, useSelector} from 'react-redux';

const screenWidth = Dimensions.get('window').width;

export default function WaterTracking() {
  const {todayProgress} = useSelector(state => state.waterTracking);
  const dispatch = useDispatch();
  console.log('todayProgress', todayProgress);
  const [target, setTarget] = useState(0);
  const [targetReach, setTargetReach] = useState(false);
  const [water, setWater] = useState(0);
  const [percentage, setPercentage] = useState(0);
  console.log('percentage', percentage);
  console.log('water', water);
  const [waterCup, setWaterCup] = useState(330);
  const [waterBottle, setWaterBottle] = useState(500);

  const [visible, setVisible] = useState(false);
  const onToggleSnackBar = () => setVisible(true);
  const onDismissSnackBar = () => setVisible(false);

  const [targetSnackVisible, setTargetSnackVisible] = useState(false);
  const onToggleTargetSnackBar = () => setTargetSnackVisible(true);
  const onDismissTargetSnackBar = () => setTargetSnackVisible(false);

  const [isTargetDialogVisible, setIsTargetDialogVisible] = useState(false);
  const [isCustomDialogVisible, setIsCustomDialogVisible] = useState(false);

  const defineTarget = userTarget => {
    dispatch(
      setDrinkGoal({drinkProgressId: todayProgress.id, goal: userTarget}),
    );
  };

  const addWater = amount => {
    if (amount) {
      dispatch(addSession({drinkProgressId: todayProgress.id, amount}));
      onToggleSnackBar();
    }
    if (valuesToPercentage(todayProgress.goal, water + amount) >= 100)
      setTargetReach(true);
  };

  useEffect(() => {
    if (todayProgress.sessions) {
      const drankWater = todayProgress.sessions.reduce((acc, item, i) => {
        return acc + item.amount;
      }, 0);
      setWater(drankWater);
      setPercentage(valuesToPercentage(todayProgress.goal, drankWater));
    }
  }, [todayProgress]);
  useEffect(() => {
    console.log('target state change ' + targetReach);
    if (targetReach === true) {
      onToggleTargetSnackBar();
      console.log('Target reached!');
    }
  }, [targetReach]);

  return (
    <View style={styles.container}>
      <Chip
        mode="outlined"
        icon="information"
        selectedColor="#2176FF"
        style={{marginTop: 10}}
        onPress={() => setIsTargetDialogVisible(true)}>
        Water target: {todayProgress.goal || 0} ml
      </Chip>
      <View style={styles.content}>
        <AnimatedCircularProgress
          style={styles.progress}
          size={245}
          width={32}
          rotation={0.25}
          arcSweepAngle={360}
          fill={percentage}
          tintColor="#2176FF"
          backgroundColor="#131A26"
          onAnimationComplete={() => console.log('onAnimationComplete')}
          childrenContainerStyle={styles.circle}
          children={() => (
            <View
              style={{alignItems: 'center', transform: [{rotate: '-45deg'}]}}>
              <Title>{water} ml</Title>
              <Text>{percentage} %</Text>
            </View>
          )}
        />
        <View style={styles.addContainer}>
          <Title style={{marginHorizontal: 70}}>+ Add a portion of water</Title>
          <View style={styles.buttons}>
            <Button
              icon="cup"
              mode="contained"
              onPress={() => addWater(waterCup)}>
              Cup
            </Button>
            <Button
              icon="glass-stange"
              mode="contained"
              onPress={() => addWater(waterBottle)}>
              Bottle
            </Button>
            <Button
              icon="water"
              mode="contained"
              onPress={() => setIsCustomDialogVisible(true)}>
              Something else
            </Button>
          </View>
        </View>
      </View>
      <Snackbar
        visible={targetSnackVisible}
        duration={2500}
        onDismiss={onDismissTargetSnackBar}
        theme={{
          colors: {surface: '#FFFFFF', onSurface: '#FDCA40', accent: '#FFFFFF'},
        }}
        action={{
          label: 'Yay!',
          onPress: () => onDismissTargetSnackBar(),
        }}>
        Congrats, you reached your water intake goal!
      </Snackbar>
      <Portal>
        <ChangeTargetDialog
          isDialogVisible={isTargetDialogVisible}
          setIsDialogVisible={setIsTargetDialogVisible}
          onClick={defineTarget}
        />
        <CustomWaterDialog
          isDialogVisible={isCustomDialogVisible}
          setIsDialogVisible={setIsCustomDialogVisible}
          addWater={addWater}
        />
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 20,
    alignItems: 'center',
  },
  content: {
    flex: 1,
    marginTop: 50,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  addContainer: {
    flex: 1,
    flexGrow: 0.45,
    flexDirection: 'row',
    alignItems: 'center',
    width: screenWidth,
    alignContent: 'space-between',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
    width: screenWidth - 100,
    alignContent: 'space-between',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
  },
  circle: {
    width: 181,
    height: 181,
    borderRadius: 120,
    borderWidth: 5,
    backgroundColor: '#27354d',
    borderColor: '#0051d4',
    borderTopLeftRadius: 10,
    borderBottomWidth: 10,
    borderRightWidth: 10,
    transform: [{rotate: '45deg'}],
    shadowColor: '#000000',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.9,
    shadowRadius: 10.0,
    elevation: 10,
  },
  progress: {
    width: 264,
    height: 264,
    marginBottom: 10,
    borderRadius: 300,
    borderWidth: 10,
    borderColor: '#0051d4',
    overflow: 'hidden',
  },
});
