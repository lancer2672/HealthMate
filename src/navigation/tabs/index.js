import React, {useEffect} from 'react';
import {Feather, Ionicons} from '@expo/vector-icons';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useTheme} from 'styled-components';

import Home from '@src/views/Home';
import CreatePost from '@src/features/post/screens/CreatePost.screen';
import {Image, Pressable, View, StyleSheet} from 'react-native';
const CreatePostButton = ({children, onPress}) => {
  const theme = useTheme();
  return (
    <Pressable
      style={[
        styles.createButton,
        {backgroundColor: theme.colors.text.secondary},
      ]}
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
      initialRouteName="Home"
      screenOptions={({route}) => {
        return {
          tabBarShowLabel: false,
          headerShown: false,
          tabBarStyle: {
            height: 50,
            borderTopWidth: 0,
            backgroundColor: theme.colors.chat.bg.secondary,
          },
          tabBarItemStyle: {
            marginLeft: route.name === 'Chat' ? 24 : 0,
            marginRight: route.name === 'Map' ? 24 : 0,
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
                  color={
                    focused
                      ? theme.colors.text.secondary
                      : theme.colors.text.primary
                  }
                />
              );
            }
            return (
              <Feather
                name={iconName}
                size={size}
                color={
                  focused
                    ? theme.colors.text.secondary
                    : theme.colors.text.primary
                }
              />
            );
          },
          tabBarActiveTintColor: theme.colors.text.primary,
          tabBarInactiveTintColor: 'gray',
        };
      }}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Map" component={<></>} />
      <Tab.Screen
        name="CreatePost"
        component={CreatePost}
        options={{
          tabBarIcon: ({focused}) => {
            return (
              <Image
                resizeMode="contain"
                style={{
                  width: 30,
                  height: 30,
                  tintColor: theme.colors.text.primary,
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
                  style={[
                    styles.pseudo,
                    {backgroundColor: theme.colors.chat.bg.primary},
                  ]}></View>
              </>
            );
          },
        }}
      />
      <Tab.Screen name="Chat" component={<></>} />
      <Tab.Screen name="User" component={<></>} />
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
    transform: [{translateX: -32}, {translateY: -25}],
  },
  createButton: {
    top: -24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    position: 'absolute',
    borderRadius: 35,
    left: '50%',
    transform: [{translateX: -24}],
  },
});
