import {
  View,
  Text,
  Keyboard,
  Pressable,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

import InputText from '../components/InputText.component';
import {accountSchema, handleValidateField} from '../../../utils/validation';
import {setUser} from '../reducer/userSlice';
import {setIsLoading} from '../../../store/appSlice';
import {useLoginMutation} from '../reducer/authApiSlice';

// GoogleSignin.configure({
//   webClientId: WEB_API_KEY,
//   offlineAccess: true,
//   scopes: [
//     'profile',
//     'email',
//     'https://www.googleapis.com/auth/user.birthday.read',
//     'https://www.googleapis.com/auth/user.phonenumbers.read',
//     'https://www.googleapis.com/auth/user.gender.read',
//   ],
// });

const Login = ({navigation}) => {
  const [login, {error, isSuccess, isLoading: isLoginLoading, data}] =
    useLoginMutation();
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [savePassword, setSavePassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const refInputName = useRef();
  const refInputPassword = useRef();
  const toggleSavePasswordCheck = () => {
    setSavePassword(!savePassword);
  };
  const handleLoginSuccess = async (loginData, isLoading, isSuccess) => {
    try {
      if (isSuccess) {
        const payload = {savePassword, ...loginData};
        dispatch(setUser(payload));
        //auto enable save password
        if (true) {
          ['token', 'refreshToken', 'username'].forEach(async key => {
            await AsyncStorage.setItem(
              key,
              JSON.stringify(loginData[key]) || eval(key),
            );
          });
          await AsyncStorage.setItem(
            'userId',
            JSON.stringify(loginData.user._id),
          );
        }
      }
    } catch (er) {
      console.log('err', er);
    }
    dispatch(setIsLoading(isLoading));
  };

  // useEffect(() => {
  //   handleLoginSuccess(loginGGData, isLoginGGLoading, isLoginGGSuccess);
  // }, [isLoginGGLoading]);

  useEffect(() => {
    handleLoginSuccess(data, isLoginLoading, isSuccess);
  }, [isLoginLoading]);

  const handleLogin = () => {
    refInputName.current.blur();
    refInputPassword.current.blur();
    console.log(Object.keys(validationErrors).length);
    if (Object.keys(validationErrors).length == 0) {
      login({username, password});
    }
  };

  const handleSendEmailResetPassword = () => {
    navigation.navigate('ForgotPassword', {});
  };

  const navigateToRegister1Screen = () => {
    // setError(null);
    navigation.navigate('Register1', {});
  };
  console.log('validationErrors', validationErrors);
  return (
    <View style={styles.container} isLoading={isLoginLoading}>
      <View>
        <InputText
          ref={refInputName}
          iconLeft={'account'}
          setText={setUsername}
          hasValidationError={validationErrors.username}
          placeholder={'Email'}
          onBlur={() =>
            handleValidateField(
              accountSchema,
              'username',
              username,
              validationErrors,
              setValidationErrors,
            )
          }></InputText>
        {validationErrors.username && <Text>{validationErrors.username}</Text>}

        <InputText
          ref={refInputPassword}
          iconLeft={'lock'}
          passwordType
          hasValidationError={validationErrors.password}
          setText={setPassword}
          onBlur={() =>
            handleValidateField(
              accountSchema,
              'password',
              password,
              validationErrors,
              setValidationErrors,
            )
          }
          placeholder={'Mật khẩu'}></InputText>
        {validationErrors.password && <Text>{validationErrors.password}</Text>}
      </View>

      <View
        style={{
          marginTop: 12,
          flexDirection: 'row',
        }}>
        <TouchableOpacity onPress={handleSendEmailResetPassword}>
          <Text style={{fontSize: 16, color: 'white'}}>Quên mật khẩu ?</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={navigateToRegister1Screen}>
          <Text
            style={{
              marginLeft: 48,
              fontWeight: '500',
              fontSize: 16,
              textDecorationLine: 'underline',
              color: 'white',
            }}>
            Đăng ký
          </Text>
        </TouchableOpacity>
      </View>
      {error && <Text>Tên đăng nhập hoặc mật khẩu không hợp lệ</Text>}
      <View style={{marginTop: 12}}>
        <TouchableOpacity onPress={handleLogin}>
          <Text>Đăng nhập</Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          marginTop: 12,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Pressable
          onPress={null}
          style={[styles.google, {backgroundColor: 'white'}]}>
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
            <Image
              resizeMode="contain"
              style={styles.logo}
              source={require('../../../assets/icons/google_icon.png')}></Image>
            <Text
              style={{
                flex: 1,
                color: 'black',
                fontSize: 16,
                textAlign: 'center',
                paddingRight: 40,
              }}>
              Tiếp tục với Google
            </Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  logo: {
    width: 32,
    height: 32,
    marginLeft: 8,
  },
  google: {
    width: 300,
    height: 42,
    borderRadius: 4,
    elevation: 2,
  },
  fb: {
    width: 50,
    height: 50,
    borderRadius: 25,
    elevation: 2,
  },
});
export default Login;
