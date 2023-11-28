import React, {useEffect} from 'react';
import {Image, Pressable, View, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useTheme} from 'styled-components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';

import WaterTracking from 'src/features/tracking-water-prog/screens/WaterTracking.screen';
import StepCounter from 'src/features/counting-steps/screens/StepCounter.screen';
const CreatePostButton = ({children, onPress}) => {
  const theme = useTheme();
  return (
    <Pressable
      style={[styles.createButton, {backgroundColor: 'green'}]}
      onPress={onPress}>
      <View style={{width: 48, height: 48}}>{children}</View>
    </Pressable>
  );
};

const Tab = createBottomTabNavigator();
export const Tabs = () => {
  const theme = useTheme();
  return (
    <Tab.Navigator
      initialRouteName="WaterTracking"
      screenOptions={({route}) => {
        return {
          tabBarShowLabel: false,
          headerShown: false,
          tabBarStyle: {
            height: 50,
            borderTopWidth: 0,
            backgroundColor: 'gray'
          },
          tabBarItemStyle: {
            marginLeft: route.name === 'Chat' ? 24 : 0,
            marginRight: route.name === 'Map' ? 24 : 0
          },
          tabBarIcon: ({focused, color, size}) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = 'home';
            } else if (route.name === 'User') {
              iconName = 'user';
            } else if (route.name === 'Map') {
              iconName = 'map-pin';
            } else if (route.name === 'Chat') {
              return (
                <Ionicons
                  name="ios-chatbubble-ellipses-outline"
                  size={24}
                  color={focused ? 'black' : 'green'}
                />
              );
            }
            return (
              <Feather
                name={iconName}
                size={size}
                color={focused ? 'white' : 'black'}
              />
            );
          },
          tabBarActiveTintColor: 'blue',
          tabBarInactiveTintColor: 'gray'
        };
      }}>
      <Tab.Screen name="Home" component={WaterTracking} />
      <Tab.Screen name="Map" component={WaterTracking} />
      <Tab.Screen
        name="CreatePost"
        component={WaterTracking}
        options={{
          tabBarIcon: ({focused}) => {
            return (
              <Image
                resizeMode="contain"
                style={{
                  width: 30,
                  height: 30
                }}></Image>
            );
          },
          tabBarButton: props => {
            return (
              <>
                <View style={{zIndex: 1}}>
                  <CreatePostButton {...props}></CreatePostButton>
                </View>
                <View
                  style={[styles.pseudo, {backgroundColor: 'tomato'}]}></View>
              </>
            );
          }
        }}
      />
      <Tab.Screen name="WaterTracking" component={WaterTracking} />
      <Tab.Screen name="StepCounter" component={StepCounter} />
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
