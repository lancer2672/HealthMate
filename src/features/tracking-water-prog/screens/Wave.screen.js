import {StatusBar} from 'expo-status-bar';
import {Dimensions, StyleSheet, View} from 'react-native';
// import {
//   Canvas,
//   LinearGradient,
//   Path,
//   Skia,
//   useClockValue,
//   useComputedValue,
//   useTouchHandler,
//   useValue,
//   vec,
// } from '@shopify/react-native-skia';
// import {line, curveBasis} from 'd3';
import {useState, useRef, useEffect} from 'react';
import Header from '../components/Header';
import SideMenu from '../components/SideMenu';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withRepeat,
  withTiming,
  withDelay,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import Svg, {Circle, Path} from 'react-native-svg';

import {Title, Text, Button, Chip, Snackbar, Portal} from 'react-native-paper';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import valuesToPercentage, {today} from '../utils';
import {firebaseDatabase} from '../../../services/firebase';
import CustomWaterDialog from '../components/CustomWaterDialog';
import {
  addSession,
  getDateProgress,
  setDrinkGoal,
} from '../../../store/reducer/thunks/waterTrackingActions';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ChangeTargetDialog from '../components/ChangeTargetDialog';
import {useTheme} from 'styled-components';

const dimension = Dimensions.get('window');

const WAVE_PHASE_HEIGHT = 32;
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const AnimatedPath = Animated.createAnimatedComponent(Path);
export default function WaveAnimation() {
  const [menuVisible, setMenuVisible] = useState(false);
  const theme = useTheme();
  const {todayProgress} = useSelector(state => state.waterTracking);
  const dispatch = useDispatch();

  const [targetReach, setTargetReach] = useState(false);
  const [water, setWater] = useState(0);
  const [percentage, setPercentage] = useState(0);

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
    waterContainerHeight.value = withTiming(0, {
      duration: 2000,
    });
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
    if (targetReach === true) {
      onToggleTargetSnackBar();
    }
  }, [targetReach]);

  // Animation
  const waterContainerHeight = useSharedValue(0);
  const y = useSharedValue(WAVE_PHASE_HEIGHT);
  const c1y = useSharedValue(30);
  const c2y = useSharedValue(-30);
  const animatedProps = useAnimatedProps(() => {
    const path = [
      `M 0 ${SCREEN_HEIGHT - waterContainerHeight.value}`,
      `c ${SCREEN_WIDTH / 4} ${c1y.value},  ${(SCREEN_WIDTH * 3) / 4} ${
        c2y.value
      }, ${SCREEN_WIDTH} 0`,

      `V ${SCREEN_HEIGHT}`,
      `H 0`,
    ].join(' ');

    return {
      d: path,
    };
  });

  //animation
  const handleWave = () => {
    if (y.value == 0) {
      //reset y value
      y.value = WAVE_PHASE_HEIGHT;
      return;
    }
    y.value = (y.value * 2) / 3;
    if (y.value <= 5) {
      y.value = 0;
    }
    c1y.value = withTiming(
      -y.value,
      {duration: y.value == 0 ? 200 : y.value * 15},
      finished => {
        if (finished) {
          c1y.value = withTiming(
            y.value,
            {duration: y.value * 10},
            runOnJS(handleWave),
          );
        }
      },
    );
    c2y.value = withTiming(
      y.value,
      {duration: y.value == 0 ? 200 : y.value * 15},
      finished => {
        if (finished) {
          c2y.value = withTiming(
            -y.value,
            {duration: y.value * 10},
            runOnJS(handleWave),
          );
        }
      },
    );
  };

  useEffect(() => {
    // if (percentage < 100) {
    // } else {
    //   waterContainerHeight.value = SCREEN_HEIGHT;
    // }
    let newHeightValue =
      //for hiding animation
      percentage > 100
        ? SCREEN_HEIGHT + WAVE_PHASE_HEIGHT
        : (percentage * SCREEN_HEIGHT) / 100;
    waterContainerHeight.value = withTiming(newHeightValue, {
      duration: 1000,
      easing: Easing.out(Easing.exp),
    });
    handleWave();
  }, [percentage]);

  return (
    <View style={styles.container(theme)}>
      <Header
        openSideMenu={() => {
          console.log('Clicked');
          setMenuVisible(true);
        }}></Header>
      <Svg
        style={{backgroundColor: theme.waterTracking.background}}
        width={SCREEN_WIDTH}
        height={'100%'}
        viewBox={`0 0 ${SCREEN_WIDTH} ${SCREEN_HEIGHT}`}>
        <AnimatedPath
          fill={theme.waterTracking.secondary}
          animatedProps={animatedProps}></AnimatedPath>
      </Svg>

      {/* <Canvas style={styles.canvas} onTouch={onToucHandler}>
        <Path path={animatedPath} style={'fill'} color={'cyan'}>
          <LinearGradient
            start={gradientStart}
            end={gradientEnd}
            colors={['cyan', 'blue']}
          />
        </Path>
      </Canvas> */}

      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          position: 'absolute',
          flexDirection: 'column',
          marginTop: 80,
          alignItems: 'center',
        }}>
        <Chip
          mode="outlined"
          icon="water"
          selectedColor="#2176FF"
          style={{marginBottom: 10}}
          onPress={() => setIsTargetDialogVisible(true)}>
          Water target: {todayProgress.goal || 0} ml
        </Chip>
        <View style={styles.content}>
          <View style={{flex: 1}}>
            <Text style={styles.percentage}>{percentage} %</Text>
            <Text style={styles.amount}>
              {todayProgress.totalAmount} / {todayProgress.goal} ml
            </Text>
          </View>
          <View style={styles.addContainer}>
            <View style={styles.buttons}>
              <Button
                icon="cup"
                style={styles.button(theme)}
                mode="contained"
                onPress={() => addWater(100)}>
                + 100 ml
              </Button>
              <Button
                style={styles.button(theme)}
                icon="glass-stange"
                mode="contained"
                onPress={() => addWater(500)}>
                + 500 ml
              </Button>
              <Button
                icon="water"
                mode="contained"
                style={styles.button(theme)}
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
            colors: {
              surface: '#FFFFFF',
              onSurface: '#FDCA40',
              accent: '#FFFFFF',
            },
          }}
          action={{
            label: 'Yay!',
            onPress: () => onDismissTargetSnackBar(),
          }}>
          Congrats, you reached your water intake goal!
        </Snackbar>
      </View>
      <ChangeTargetDialog
        onClick={defineTarget}
        onClose={() => setIsTargetDialogVisible(false)}
        isVisible={isTargetDialogVisible}></ChangeTargetDialog>
      <SideMenu
        isVisible={menuVisible}
        onClose={() => setMenuVisible(false)}></SideMenu>
    </View>
  );
}

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    backgroundColor: theme.waterTracking.background,
  }),
  canvas: {
    flex: 1,
  },
  button: theme => ({
    borderRadius: 4,
    borderWidth: 2,
    marginVertical: 12,
    borderColor: theme.background,
    backgroundColor: theme.waterTracking.background,
  }),
  addContainer: {
    flexGrow: 0.45,
    flexDirection: 'row',
    alignItems: 'center',
    width: SCREEN_WIDTH,
    alignContent: 'space-between',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 28,

    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
  },
  percentage: {
    fontSize: 62,
    textAlign: 'center',
    color: 'white',
  },
  amount: {
    fontSize: 32,
    textAlign: 'center',
    color: 'white',
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
