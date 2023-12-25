import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useEffect} from 'react';
import {AppState} from 'react-native';

import {useDispatch, useSelector} from 'react-redux';
import {getDateProgress} from 'src/store/reducer/thunks/waterTrackingActions';
import DetailNutriFood from '../features/food/screens/DetailNutriFood.screen';
import LogFood from '../features/food/screens/LogFood.screen';
import SearchFood from '../features/food/screens/SearchFood.screen';
import DetailMealDate from '../features/meal/screens/DetailMealDate.screen';
import EditFood from '../features/meal/screens/EditFood.screen';

import googleFit from 'react-native-google-fit';
import StepCounter from 'src/features/counting-steps/screens/StepCounter.screen';
import ListExercise from 'src/features/exercise/components/exercise/ListExercise';
import BreakScreen from 'src/features/exercise/screens/Break.screen';
import DetailExercise from 'src/features/exercise/screens/DetailExercise';
import DoExercise from 'src/features/exercise/screens/DoExercise';
import FinishScreen from 'src/features/exercise/screens/FinishScreen';
import ReadyExercise from 'src/features/exercise/screens/ReadyExercise';
import ExerciseGroup from 'src/features/exercise/screens/group/ExerciseGroup';
import AddSongToPlaylist from 'src/features/exercise/screens/music/AddSongToPlaylist';
import DetailPlaylist from 'src/features/exercise/screens/music/DetailPlaylist';
import SelectMusic from 'src/features/exercise/screens/music/SelectMusic';
import DetailPlan from 'src/features/exercise/screens/plan/DetailPlan';
import UserProfile from 'src/features/profile/screens/UserProfile';
import WaterTrackingHistory from 'src/features/tracking-water-prog/screens/History.screen';
import WaterTracking from 'src/features/tracking-water-prog/screens/WaterTracking.screen';
import {useActivity} from 'src/hooks/useActivity';
import useNotification from 'src/hooks/useNotification';
import {trackingNotificationIns} from 'src/services/notifee/TrackingNotification';
import {waterTrackingSelector} from 'src/store/selectors';
import enableTrackingUserActivities from '../config/trackingActivities';
import {Tabs} from './tabs';
const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  const dispatch = useDispatch();
  const {user} = useSelector(state => state.user);
  const {enableActivityTracking} = useActivity();
  const {todayProgress} = useSelector(waterTrackingSelector);
  const {} = useNotification();
  console.log('todayProgresstodayProgress', todayProgress);

  useEffect(() => {
    const now = new Date();
    const userId = user.uid;
    const dateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    //get daily water drink prog
    dispatch(getDateProgress({userId, date: dateOnly}));
    // tracking user's activties
    const trackUserActivities = async () => {
      let isAllowed = await enableTrackingUserActivities();
      if (isAllowed) {
        enableActivityTracking();
      }
    };

    trackUserActivities();

    return () => {
      googleFit.unsubscribeListeners();
    };
  }, []);

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);
  }, []);

  const handleAppStateChange = async nextAppState => {
    console.log('StateChanged', nextAppState);
    if (nextAppState === 'active') {
      trackingNotificationIns.show = false;
      await trackingNotificationIns.stopForegroundService();
    } else {
      trackingNotificationIns.show = true;
      await trackingNotificationIns.displayActivityTrackingNotification();
    }
  };

  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="AppTabs">
      <Stack.Screen name="AppTabs" component={Tabs} />
      <Stack.Screen name="WaterTracking" component={WaterTracking} />
      <Stack.Screen name="ListExercise" component={ListExercise} />
      <Stack.Screen name="UserProfile" component={UserProfile} />
      <Stack.Screen name="StepCounter" component={StepCounter} />
      <Stack.Screen name="SelectMusic" component={SelectMusic} />
      <Stack.Screen name="ExerciseGroup" component={ExerciseGroup} />
      <Stack.Screen name="AddSongToPlaylist" component={AddSongToPlaylist} />
      <Stack.Screen name="ReadyExercise" component={ReadyExercise} />
      <Stack.Screen name="FinishScreen" component={FinishScreen} />
      <Stack.Screen name="BreakScreen" component={BreakScreen} />
      <Stack.Screen name="DoExercise" component={DoExercise} />
      <Stack.Screen name="DetailPlan" component={DetailPlan} />
      <Stack.Screen name="DetailExercise" component={DetailExercise} />
      <Stack.Screen name="DetailPlaylist" component={DetailPlaylist} />
      <Stack.Screen
        name="WaterTrackingHistory"
        component={WaterTrackingHistory}
      />
      <Stack.Screen
        name="DetailMealDate"
        component={DetailMealDate}
        options={{
          headerShown: true,
          headerTitle: 'Back'
        }}
      />
      <Stack.Screen
        name="EditFood"
        component={EditFood}
        options={{
          headerShown: true,
          headerTitle: 'Edit food',
          headerBackTitle: 'Back'
        }}
      />
      <Stack.Screen
        name="Search food"
        component={SearchFood}
        options={{
          headerShown: true,
          headerTitle: 'Back'
        }}
      />
      <Stack.Screen name="LogFood" component={LogFood} />
      <Stack.Screen name="DetailNutriFood" component={DetailNutriFood} />
    </Stack.Navigator>
  );
};
