import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import moment from 'moment';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useSelector} from 'react-redux';
import {useTheme} from 'styled-components';

const Header = ({openSideMenu}) => {
  const theme = useTheme();
  const {todayProgress} = useSelector(state => state.waterTracking);
  const today = moment();
  const formattedDate = today.format('dddd, D MMM YYYY');
  return (
    <View style={styles.container(theme)}>
      <View>
        <Text style={styles.date}>{formattedDate}</Text>
        <Text style={styles.goal}>
          {todayProgress.totalAmount} / {todayProgress.goal} ml
        </Text>
      </View>
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity style={{paddingHorizontal: 4}} onPress={openSideMenu}>
          <Entypo name="menu" size={30} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
//#00bbfb   - #04a0d7
export default Header;

const styles = StyleSheet.create({
  container: theme => ({
    height: 70,
    backgroundColor: theme.waterTracking.background,
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
  }),
  date: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  goal: {
    color: 'white',
  },
});
