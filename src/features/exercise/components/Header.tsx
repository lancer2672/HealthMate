import {useNavigation} from '@react-navigation/native';
import {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import SideMenu from './SideMenu';

const Header = ({}) => {
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation<any>();
  const navigateToHistoryScreen = () => {};
  const navigationToExericseGroup = () => {
    navigation.navigate('ExerciseGroup');
  };
  const navigateToUserProfile = () => {
    navigation.navigate('UserProfile');
  };
  const openSideMenu = () => {
    setVisible(true);
  };
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.date}>Healthmate</Text>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity
          style={{paddingHorizontal: 4, marginHorizontal: 8}}
          onPress={navigationToExericseGroup}>
          <MaterialIcons name="group" size={24} color="black" />
        </TouchableOpacity>

        {/* <TouchableOpacity
          style={{paddingHorizontal: 4, marginHorizontal: 12}}
          onPress={navigateToHistoryScreen}>
          <Feather name="bell" size={28} color="black" />
          <View style={styles.dot}></View>
        </TouchableOpacity> */}
        <TouchableOpacity
          style={{paddingHorizontal: 4, marginHorizontal: 8}}
          onPress={navigateToUserProfile}>
          <Ionicons name="person" size={20} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          style={{paddingHorizontal: 4, marginHorizontal: 8}}
          onPress={openSideMenu}>
          <Ionicons name="settings" size={30} color="black" />
        </TouchableOpacity>
        <SideMenu
          isVisible={visible}
          onClose={() => {
            setVisible(false);
          }}></SideMenu>
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
