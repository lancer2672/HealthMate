import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';

import {Avatar} from '@ui-kitten/components';
import {useEffect, useState} from 'react';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import * as Animatable from 'react-native-animatable';
import styled from 'styled-components/native';

import {useDispatch, useSelector} from 'react-redux';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {DISABLE_MUSIC} from 'src/constants';
import useNotification from 'src/hooks/useNotification';
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
  const handleLogout = () => {
    // dispatch(logoutUser());
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
      defaultSwitchValue: isNotificationEnabled,
      onClick: async () => {
        await disableNotification();
      }
    },
    {
      name: 'Skip music selection screen',
      defaultSwitchValue: isHideScreen,
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
          <SettingCategory>Personal information</SettingCategory>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('EditProfile');
            }}
            style={{
              marginTop: 12,
              flexDirection: 'row',
              alignItems: 'center'
            }}>
            <Avatar source={{uri: user.avatar}}></Avatar>
            <View style={{marginLeft: 12, flex: 1}}>
              <Text style={{color: 'black', fontSize: 18}}>{user.mail}</Text>
              <Text style={{color: 'black'}}>Your profile</Text>
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
          <SettingCategory>General</SettingCategory>

          <FlatList
            data={settingOptionsWithSwitch}
            renderItem={({item}) => <SettingItemWithSwitch {...item} />}
            keyExtractor={item => item.name}
          />
        </Body>
        <LogoutButton onPress={handleLogout}>
          <LogoutText>Loggout</LogoutText>
        </LogoutButton>
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
