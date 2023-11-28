import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import moment from 'moment';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';

import {useSelector} from 'react-redux';
import {useTheme} from 'styled-components';
import {userSelector} from 'src/store/selectors';

const Header = ({}) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const {user} = useSelector(userSelector);
  const navigateToHistoryScreen = () => {
    navigation.navigate('WaterTrackingHistory');
  };
  const openSideMenu = () => {};
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.date}>{`Hello $username`}</Text>
        {/* <Text style={styles.goal}></Text> */}
      </View>
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          style={{paddingHorizontal: 4, marginHorizontal: 12}}
          onPress={navigateToHistoryScreen}>
          <Feather name="bell" size={28} color="black" />
          <View style={styles.dot}></View>
        </TouchableOpacity>

        <TouchableOpacity style={{paddingHorizontal: 4}} onPress={openSideMenu}>
          <Entypo name="menu" size={30} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default Header;

const styles = StyleSheet.create({
  container: {
    height: 70,
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  date: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black'
  },
  goal: {
    color: 'black'
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 8,
    backgroundColor: 'red',
    position: 'absolute',
    top: 0,
    right: 8
  }
});
