import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Pressable, StyleSheet, View} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {useTheme} from 'styled-components/native';

import StepCounter from 'src/features/counting-steps/screens/StepCounter.screen';
import ExerciseHome from 'src/features/exercise/screens/ExerciseHome.screen';
import TodayMealDate from 'src/features/meal/screens/TodayMealDate.screen';
import Todolist from 'src/features/todolist/screens/TodoList.screen';
import WaterTracking from 'src/features/tracking-water-prog/screens/WaterTracking.screen';
const ExerciseHomeButton = ({children, onPress}) => {
  const theme = useTheme();
  return (
    <Pressable
      style={[styles.createButton, {backgroundColor: theme.green1}]}
      onPress={onPress}>
      <View style={{width: 48, height: 48}}>{children}</View>
    </Pressable>
  );
};

export const TAB_ROUTES = {
  NOTE: 'Note',
  FOOD: 'TodayMealDate',
  HOME: 'Home',
  WATER_TRACKING: 'WaterTracking',
  STEP_COUNTER: 'StepCounter'
};

const Tab = createBottomTabNavigator();
export const Tabs = () => {
  const getIcon = (routeName, color, size) => {
    switch (routeName) {
      case TAB_ROUTES.FOOD:
        return <MaterialCommunityIcons name="food" size={size} color={color} />;
      case TAB_ROUTES.NOTE:
        return <SimpleLineIcons name="note" size={size} color={color} />;
      case TAB_ROUTES.HOME:
        return <Feather name="home" size={size} color={color} />;
      case TAB_ROUTES.WATER_TRACKING:
        return (
          <MaterialCommunityIcons name="cup-water" size={size} color={color} />
        );
      case TAB_ROUTES.STEP_COUNTER:
        return <FontAwesome5 name="running" size={size} color={color} />;
      default:
        return null;
    }
  };
  const theme = useTheme();
  return (
    <Tab.Navigator
      initialRouteName={TAB_ROUTES.HOME}
      screenOptions={({route}) => {
        return {
          tabBarShowLabel: false,
          headerShown: false,
          tabBarStyle: {
            height: 50,
            borderTopWidth: 0,
            backgroundColor: theme.green3
          },
          tabBarItemStyle: {
            marginLeft: route.name === TAB_ROUTES.WATER_TRACKING ? 24 : 0,
            marginRight: route.name === TAB_ROUTES.FOOD ? 24 : 0
          },
          tabBarIcon: ({focused, _, size}) => {
            const color = focused ? 'white' : 'black';
            return getIcon(route.name, color, size);
          },
          tabBarActiveTintColor: 'blue',
          tabBarInactiveTintColor: 'gray'
        };
      }}>
      <Tab.Screen name={TAB_ROUTES.NOTE} component={Todolist} />
      <Tab.Screen name={TAB_ROUTES.FOOD} component={TodayMealDate} />
      <Tab.Screen
        name={TAB_ROUTES.HOME}
        component={ExerciseHome}
        options={{
          tabBarIcon: ({focused}) => {
            const color = focused ? 'white' : 'black';

            return <Entypo name="home" size={24} color={color} />;
          },
          tabBarButton: props => {
            return (
              <>
                <View style={{zIndex: 1}}>
                  <ExerciseHomeButton {...props}></ExerciseHomeButton>
                </View>
                <View style={[styles.pseudo]}></View>
              </>
            );
          }
        }}
      />
      <Tab.Screen name={TAB_ROUTES.WATER_TRACKING} component={WaterTracking} />
      <Tab.Screen name={TAB_ROUTES.STEP_COUNTER} component={StepCounter} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  pseudo: {
    width: 64,
    height: 32,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    left: '50%',
    top: '50%',
    zIndex: 0,
    position: 'absolute',
    transform: [{translateX: -32}, {translateY: -25}]
  },
  createButton: {
    top: -24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    position: 'absolute',
    borderRadius: 35,
    left: '50%',
    transform: [{translateX: -36}]
  }
});
