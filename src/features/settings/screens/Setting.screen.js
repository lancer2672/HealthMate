import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {Avatar} from '@ui-kitten/components';
import {useEffect, useState} from 'react';
import {FlatList, Modal, Text, TouchableOpacity, View} from 'react-native';
import * as Animatable from 'react-native-animatable';
import styled from 'styled-components/native';

import {useDispatch, useSelector} from 'react-redux';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {DISABLE_MUSIC} from 'src/constants';
import useNotification from 'src/hooks/useNotification';
import {
  logoutUser,
  updateUserInfoAction
} from 'src/store/reducer/thunks/userActions';
import {userSelector} from 'src/store/selectors';
import {
  SettingItemWithSwitch,
  SettingItemWithoutSwitch
} from '../components/SettingItem.component';

const Settings = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {user} = useSelector(userSelector);
  const {isNotificationEnabled, disableNotification} = useNotification();
  const [isHideScreen, setHideMusicScreen] = useState(false);
  const [visible, setVisible] = useState(false);
  const handleLogout = () => {
    dispatch(logoutUser(user.uid));
  };

  useEffect(() => {
    (async () => {
      const hideMusic = await AsyncStorage.getItem(DISABLE_MUSIC);
      if (hideMusic) {
        setHideMusicScreen(true);
      }
    })();
  }, []);
  const settingOptions = [
    {
      name: 'Reset password',
      icon: 'lock',
      iconColor: '#356e2a',
      backgroundIconColor: '#60bf4d',
      onClick: () => {
        // navigation.navigate('ResetPassword');
      }
    }
  ];
  const settingOptionsWithSwitch = [
    {
      name: 'Allow notification',
      icon: 'bell',
      iconColor: '#8024c7',
      backgroundIconColor: '#ae9bbd',
      defaultSwitchgoal: isNotificationEnabled,
      onClick: async () => {
        await disableNotification();
      }
    },
    {
      name: 'Skip music selection screen',
      defaultSwitchgoal: isHideScreen,
      icon: 'note',
      iconColor: '#2442c7',
      backgroundIconColor: '#9b9ebd',
      onClick: async isAllowed => {
        if (isAllowed) {
          await AsyncStorage.setItem(DISABLE_MUSIC, 'allow');
          setHideMusicScreen(true);
        } else {
          await AsyncStorage.removeItem(DISABLE_MUSIC);
          setHideMusicScreen(false);
        }
      }
    }
  ];
  return (
    <Container>
      <Animatable.View
        useNativeDriver={true}
        style={{flex: 1}}
        easing={'ease-in-out'}>
        <Header>
          <BackButton
            onPress={() => {
              navigation.goBack();
            }}>
            <AntDesign name="arrowleft" size={24} color="black" />
          </BackButton>
          <Heading>Settings</Heading>
        </Header>

        <Body>
          <SettingCategory>Profile</SettingCategory>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('EditProfile');
            }}
            style={{
              marginTop: 12,
              flexDirection: 'row',
              alignItems: 'center'
            }}>
            <Avatar
              source={
                user.avatar
                  ? {uri: user.avatar}
                  : require('../../../assets/imgs/DefaultAvatar.png')
              }></Avatar>
            <View style={{marginLeft: 12, flex: 1}}>
              <Text style={{color: 'black', fontSize: 18}}>{user.name}</Text>
              <Text style={{color: 'black'}}>{user.email}</Text>
            </View>
            <IconContainer>
              <Entypo name="chevron-right" size={24} color="white" />
            </IconContainer>
          </TouchableOpacity>

          <SettingCategory>Account</SettingCategory>
          <View>
            <FlatList
              data={settingOptions}
              renderItem={({item}) => <SettingItemWithoutSwitch {...item} />}
              keyExtractor={item => item.name}
            />
          </View>

          <SettingCategory>Goal</SettingCategory>
          <View>
            <SettingItemWithoutSwitch
              onClick={() => {
                setVisible(true);
              }}
              name={mappingGoal(user.goal)}
              icon="man"
              backgroundIconColor={'#b2bf4d'}
              iconColor={'#666e2a'}
            />
          </View>
          <SettingCategory>General</SettingCategory>

          <FlatList
            data={settingOptionsWithSwitch}
            renderItem={({item}) => <SettingItemWithSwitch {...item} />}
            keyExtractor={item => item.name}
          />
        </Body>
        <LogoutButton onPress={handleLogout}>
          <LogoutText>Logout</LogoutText>
        </LogoutButton>
        <GoalModal
          visible={visible}
          onClose={() => setVisible(false)}></GoalModal>
      </Animatable.View>
    </Container>
  );
};

const Container = styled.View`
  padding: 20px;
  background-color: white;
  flex: 1;
`;
const Body = styled.View`
  flex: 1;
`;
const SettingCategory = styled.Text`
  margin-top: 20px;

  font-size: 18px;
  color: black;
`;
const LogoutButton = styled.TouchableOpacity`
  border-radius: 4px;
  padding-vertical: 4px;
  background-color: gray;
`;
const IconContainer = styled.View`
  border-radius: 8px;
  background-color: gray;
  padding: 8px;
  margin-left: 12px;
`;
const LogoutText = styled.Text`
  text-align: center;
  padding-vertical: 4px;
  font-weight: 500;
  color: black;
  font-size: 16px;
`;
const Header = styled.View`
  flex-direction: row;
  align-items: center;
`;

const BackButton = styled.TouchableOpacity`
  padding-horizontal: 8px;
  padding-vertical: 4px;
`;

const Heading = styled.Text`
  font-weight: bold;
  font-size: 24px;
  color: black;
`;

export default Settings;

import {StyleSheet} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {GOAL} from 'src/constants';
import {mappingGoal} from 'src/utils/tranformData';

const GoalModal = ({visible, onClose}) => {
  const {user} = useSelector(userSelector);
  const [goal, setGoal] = useState(user.goal);
  const dispatch = useDispatch();
  const handleUpdateUserInfo = () => {
    const userInfo = {
      uid: user.uid,
      goal
    };
    dispatch(
      updateUserInfoAction({userId: user.uid, userData: {...user, ...userInfo}})
    );
    showMessage({
      message: 'Saved successfully',
      type: 'success'
    });
  };
  const saveUserGoal = () => {
    if (goal) {
      handleUpdateUserInfo();
    }
    onClose();
  };
  const navigateBack = () => {};
  return (
    <Modal visible={visible} onRequestClose={onClose} animationIn="fade">
      <View style={styles.container}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="arrow-back" size={28} color="black" />
          </TouchableOpacity>
          <Text style={styles.question}>Change your goal</Text>
        </View>
        <View style={styles.textContainer}>
          <TouchableOpacity
            onPress={() => {
              setGoal(GOAL.FITTER);
            }}
            style={[
              styles.card,
              {backgroundColor: goal === GOAL.FITTER ? '#d4d4d4' : 'white'}
            ]}>
            <Text style={styles.title}>Get fitter</Text>
            <Text style={styles.subtitle}>Tone up & feel healthy</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setGoal(GOAL.FIT);
            }}
            style={[
              styles.card,
              {backgroundColor: goal === GOAL.FIT ? '#d4d4d4' : 'white'}
            ]}>
            <Text style={styles.title}>Keep fit</Text>
            <Text style={styles.subtitle}>Maintain a healthy lifestyle</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setGoal(GOAL.LOSE_WEIGHT);
            }}
            style={[
              styles.card,
              {
                backgroundColor: goal === GOAL.LOSE_WEIGHT ? '#d4d4d4' : 'white'
              }
            ]}>
            <Text style={styles.title}>Lose weight</Text>
            <Text style={styles.subtitle}>Get motivated & energized</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            marginTop: 'auto',
            width: '100%'
          }}>
          <TouchableOpacity onPress={saveUserGoal} style={styles.btn}>
            <Text style={{fontWeight: 'bold', color: 'white', fontSize: 28}}>
              Save
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1
  },
  question: {
    fontSize: 32,
    fontWeight: '500',
    marginTop: 12,
    marginBottom: 24,
    color: 'black'
  },
  card: {
    marginVertical: 12,
    marginHorizontal: 30,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2
  },
  textContainer: {
    width: '100%'
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'black'
  },
  subtitle: {
    color: 'black',

    color: '#6c757d' // Bootstrap's secondary color for a lighter, muted color
  },
  btn: {
    marginBottom: 20,
    padding: 8,
    borderRadius: 8,
    elevation: 2,
    backgroundColor: '#b5b5b5',
    alignItems: 'center',
    marginHorizontal: 20
  }
});
