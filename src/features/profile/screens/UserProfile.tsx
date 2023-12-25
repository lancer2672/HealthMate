import RNDateTimePicker from '@react-native-community/datetimepicker';
import {ScrollView, Text, View} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components/native';

import {useState} from 'react';
import CustomEditText from 'src/components/EditText';

import {Avatar} from 'react-native-paper';
import {updateUserInfoAction} from 'src/store/reducer/thunks/userActions';
import {userSelector} from 'src/store/selectors';
import GenderSelection from '../components/GenderSelection';

const dayjs = require('dayjs');

const UserProfile = ({navigation}) => {
  const {user} = useSelector(userSelector);

  const dispatch = useDispatch();
  const [nickname, setNickname] = useState(user.nickname || user.email);
  const [gender, setGender] = useState(user.gender || 0);
  const [dateOfBirth, setDateOfBirth] = useState(
    user.dateOfBirth ? new Date(user.dateOfBirth) : new Date()
  );

  const [email, setEmail] = useState(user.email);
  const [BMI, setBMI] = useState(user.BMI || '');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGenderSelection, setShowGenderSelection] = useState(false);

  const handleUpdateUserInfo = async () => {
    const userInfo = {
      uid: user.uid,
      nickname: nickname,
      gender: gender,
      dateOfBirth: dateOfBirth,
      email: email,
      BMI: BMI
    };
    dispatch(updateUserInfoAction(userInfo))
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
  const onGenderFieldClick = () => {
    setShowGenderSelection(true);
  };
  const onDateOfBirthFieldClick = () => {
    setShowDatePicker(true);
  };
  const hasCharacter = text => {
    return /[a-zA-Z]/.test(text);
  };
  const handleTextChange = value => {
    if (hasCharacter(value)) {
    } else {
      setBMI(value);
    }
  };
  return (
    <ScrollView
      style={{
        padding: 20,
        backgroundColor: 'white',
        flex: 1
        // opacity: showGenderSelection || isLoading ? 0.6 : 1,
      }}>
      <Header>
        <BackButton
          onPress={() => {
            navigation.goBack();
          }}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </BackButton>
        <Heading>Thông tin cá nhân</Heading>
      </Header>

      <Body>
        <Avatar.Image
          size={80}
          source={
            user.avatar
              ? {uri: user.avatar}
              : {uri: 'https://i.pravatar.cc/300'}
          }
        />

        <Text
          style={{
            fontSize: 18,
            fontWeight: '500',
            color: 'white'
          }}>
          {user.nickname}
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
          label="Tên"
          style={{width: '100%'}}
          value={nickname}
          onChangeText={newText => setNickname(newText)}></CustomEditText>
        <View style={{flexDirection: 'row'}}>
          <CustomEditText
            label="Giới tính"
            onPress={onGenderFieldClick}
            style={{flex: 1, marginRight: 20}}
            editable={false}
            value={gender == 0 ? 'Male' : 'Female'}></CustomEditText>
          <CustomEditText
            label={'Ngày sinh'}
            style={{flex: 1}}
            editable={false}
            value={dayjs(dateOfBirth).format('DD-MM-YYYY')}
            onPress={onDateOfBirthFieldClick}></CustomEditText>
        </View>
        <CustomEditText
          label={'Email'}
          style={{width: '100%'}}
          value={email}
          onChangeText={newText => setEmail(newText)}></CustomEditText>
        <CustomEditText
          label={'BMI'}
          style={{width: '100%'}}
          value={BMI}
          onChangeText={handleTextChange}></CustomEditText>
      </Body>

      <SaveBtn onPress={handleUpdateUserInfo}>
        <SaveBtnText>Lưu</SaveBtnText>
      </SaveBtn>

      {showDatePicker && (
        <RNDateTimePicker
          maximumDate={new Date()}
          mode="date"
          onChange={(e, date) => {
            if (e.type == 'set') {
              setDateOfBirth(date);
            }
            setShowDatePicker(false);
          }}
          value={
            dateOfBirth == null ? new Date() : dateOfBirth
          }></RNDateTimePicker>
      )}
      <GenderSelection
        visible={showGenderSelection}
        onClose={() => {
          setShowGenderSelection(false);
        }}
        gender={gender}
        setGender={setGender}></GenderSelection>
    </ScrollView>
  );
};

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
export default UserProfile;
