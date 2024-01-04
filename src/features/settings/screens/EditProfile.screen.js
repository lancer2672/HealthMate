import {Select, SelectItem} from '@ui-kitten/components';
import {useEffect, useState} from 'react';
import {ScrollView, Text, View} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Foundation from 'react-native-vector-icons/Foundation';
import {useDispatch, useSelector} from 'react-redux';
import CustomEditText from 'src/components/EditText';
import styled from 'styled-components/native';

import {Avatar} from 'react-native-paper';
import {GENDER, LIFE_STYLE} from 'src/constants';
import {updateUserInfoAction} from 'src/store/reducer/thunks/userActions';
import {userSelector} from 'src/store/selectors';
import {mappingLifeStyleValue} from 'src/utils/tranformData';

const dayjs = require('dayjs');

const Life_Style = [
  LIFE_STYLE.SEDENTARY,
  LIFE_STYLE.LIGHTLY_ACTIVE,
  LIFE_STYLE.MODERATELY_ACTIVE,
  LIFE_STYLE.VERY_ACTIVE,
  LIFE_STYLE.EXTREMELY_ACTIVE
];
const EditProfile = ({navigation}) => {
  const {user} = useSelector(userSelector);

  const dispatch = useDispatch();
  const [name, setName] = useState(user.name);
  const [gender, setGender] = useState(user.gender || 1);
  const [height, setHeight] = useState(user.height);
  const [weight, setWeight] = useState(user.weight);
  const [lifestyle, setLifestyle] = useState(user.lifestyle);
  const [age, setAge] = useState(user.age);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const handleUpdateUserInfo = async () => {
    const userInfo = {
      uid: user.uid,
      name,
      gender,
      height,
      weight,
      lifestyle,
      age
    };
    dispatch(
      updateUserInfoAction({userId: user.uid, userData: {...user, ...userInfo}})
    )
      .then(() => {
        showMessage({
          message: 'Cập nhật thành công',
          type: 'success'
        });
      })
      .catch(() => {
        showMessage({
          message: 'Cập nhật thất bại',
          type: 'danger'
        });
      });
  };
  const handleSelectLifeStyle = index => {
    console.log('handleSelectLifeStyle', index.row);
    setSelectedIndex(index);
  };
  useEffect(() => {
    if (selectedIndex) {
      const findLifeStyle = Life_Style[selectedIndex.row];
      setLifestyle(findLifeStyle);
    }
  }, [selectedIndex]);
  return (
    <ScrollView
      style={{
        padding: 12,
        backgroundColor: 'white',
        flex: 1
      }}>
      <Header>
        <BackButton
          onPress={() => {
            navigation.goBack();
          }}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </BackButton>
        <Heading>Personal Information</Heading>
      </Header>

      <Body>
        <Avatar.Image
          size={80}
          source={
            user.avatar
              ? {uri: user.avatar}
              : require('../../../assets/imgs/DefaultAvatar.png')
          }
        />

        <Text
          style={{
            fontSize: 18,
            fontWeight: '500',
            color: 'black'
          }}>
          {user.name}
        </Text>
        <Text
          style={{
            fontSize: 18,
            color: 'gray',
            fontWeight: 400
          }}>{`${user.email}`}</Text>

        <View
          style={{
            marginTop: 20,
            marginBottom: 8,
            width: '100%',
            borderColor: 'gray',
            borderBottomWidth: 1
          }}></View>

        <CustomEditText
          label="Name"
          style={{width: '100%'}}
          value={name}
          onChangeText={newText => setName(newText)}></CustomEditText>
        <View style={{flexDirection: 'row'}}>
          <CustomEditText
            label="Height"
            onChangeText={setHeight}
            style={{flex: 1.2, marginRight: 12}}
            inputMode={'numeric'}
            afix=" cm"
            value={height}></CustomEditText>
          <CustomEditText
            label={'Weight'}
            style={{flex: 1.2, marginRight: 12}}
            inputMode={'numeric'}
            value={weight}
            afix=" kg"
            onChangeText={setWeight}></CustomEditText>
          <CustomEditText
            label={'Age'}
            style={{flex: 1}}
            inputMode={'numeric'}
            value={age}
            onChangeText={setAge}></CustomEditText>
        </View>

        <Select
          style={{
            width: '100%',
            borderColor: 'gray',
            borderWidth: 1,
            borderRadius: 4,
            marginBottom: 12
          }}
          selectedIndex={selectedIndex}
          onSelect={handleSelectLifeStyle}
          value={
            selectedIndex
              ? mappingLifeStyleValue(Life_Style[selectedIndex.row])
              : 'Your life style'
          }
          placeholder="Your life style">
          {Life_Style.map(i => (
            <SelectItem title={mappingLifeStyleValue(i)} />
          ))}
        </Select>
        <GenderSubContainer>
          <Text style={{marginLeft: 12, marginTop: 4}}>Gender</Text>
          <View style={{flexDirection: 'row', width: '100%'}}>
            <Card
              onPress={() => {
                setGender(GENDER.MALE);
              }}
              style={[
                {backgroundColor: gender === GENDER.MALE ? '#d4d4d4' : 'white'}
              ]}>
              <Foundation name="male-symbol" size={40} color="#0000FF" />
              <Title>Male</Title>
            </Card>
            <Card
              onPress={() => {
                setGender(GENDER.FEMALE);
              }}
              style={[
                {
                  backgroundColor:
                    gender === GENDER.FEMALE ? '#d4d4d4' : 'white'
                }
              ]}>
              <Foundation name="female-symbol" size={40} color="#FFC0CB" />
              <Title>Female</Title>
            </Card>
          </View>
        </GenderSubContainer>
      </Body>

      <SaveBtn onPress={handleUpdateUserInfo}>
        <SaveBtnText>Save</SaveBtnText>
      </SaveBtn>
    </ScrollView>
  );
};

const Card = styled.TouchableOpacity`
  flex: 1;
  align-items: center;
  justify-content: center;
  margin-vertical: 12px;
  margin-horizontal: 20px;
  padding: 20px;
  background-color: #fff;
  border-radius: 5px;
  shadow-color: gray;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.8;
  shadow-radius: 2px;
  elevation: 2;
`;

const GenderSubContainer = styled.View`
  width: 100%;
  border-width: 1px;
  border-radius: 12px;
  border-color: gray;
`;

const Title = styled.Text`
  font-weight: bold;
  font-size: 16px;
  color: black;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
`;
const Body = styled.View`
  padding-vertical: 20px;
  flex: 1;

  justify-content: center;
  align-items: center;
`;
const BackButton = styled.TouchableOpacity`
  padding-horizontal: 8px;
  padding-vertical: 4px;
`;
const SaveBtn = styled.TouchableOpacity`
  background-color: gray;
  padding: 8px;
  border-radius: 8px;
`;
const SaveBtnText = styled.Text`
  text-align: center;
  font-size: 20px;
  font-weight: 500;
  color: white;
`;
const Heading = styled.Text`
  font-weight: bold;
  font-size: 28px;
  color: black;
`;
export default EditProfile;
