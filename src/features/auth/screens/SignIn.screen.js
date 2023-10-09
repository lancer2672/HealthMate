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

import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import InputText from '../components/InputText.component';
import {accountSchema, handleValidateField} from '../../../utils/validation';
import {setIsLoading} from '../../../store/reducer/appSlice';
import {login, register} from '../../../store/reducer/thunks/userActions';
import {WEB_API_KEY} from '@env';

GoogleSignin.configure({
  webClientId: WEB_API_KEY,
  offlineAccess: true,
});

const Login = ({navigation}) => {
  const {error, isLoading} = useSelector(state => state.user);
  const dispatch = useDispatch();
  const [email, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const refInputName = useRef();
  const refInputPassword = useRef();
  // const toggleSavePasswordCheck = () => {
  //   setSavePassword(!savePassword);
  // };
  // const handleLoginSuccess = async (loginData, isLoading, isSuccess) => {
  //   try {
  //     if (isSuccess) {
  //       const payload = {savePassword, ...loginData};
  //       dispatch(setUser(payload));
  //     }
  //   } catch (er) {
  //     console.log('err', er);
  //   }
  //   dispatch(setIsLoading(isLoading));
  // };

  // useEffect(() => {
  //   handleLoginSuccess(loginGGData, isLoginGGLoading, isLoginGGSuccess);
  // }, [isLoginGGLoading]);

  // useEffect(() => {
  //   handleLoginSuccess(data, isLoginLoading, isSuccess);
  // }, [isLoginLoading]);

  const handleLogin = () => {
    // refInputName.current.blur();
    // refInputPassword.current.blur();
    // console.log(Object.keys(validationErrors).length);
    // if (Object.keys(validationErrors).length == 0) {
    //   login({email, password});
    // }
    dispatch(login({email, password}));
  };

  const handleSendEmailResetPassword = () => {
    navigation.navigate('ForgotPassword', {});
  };

  const handleSignInGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log('userInfo', userInfo);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('Sign in SIGN_IN_CANCELLED');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Sign in IN_PROGRESS');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Sign in PLAY_SERVICES_NOT_AVAILABLE');
      } else {
        console.error('Sign in ERROR', error);
      }
    }
  };
  const navigateToRegister1Screen = () => {
    // setError(null);
    navigation.navigate('Register1', {});
  };
  console.log('validationErrors', validationErrors);
  return (
    <View style={styles.container}>
      <View>
        <InputText
          ref={refInputName}
          iconLeft={'account'}
          setText={setUsername}
          hasValidationError={validationErrors.email}
          placeholder={'Email'}
          onBlur={() =>
            handleValidateField(
              accountSchema,
              'email',
              email,
              validationErrors,
              setValidationErrors,
            )
          }></InputText>
        {validationErrors.email && <Text>{validationErrors.email}</Text>}

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
      <TouchableOpacity
        style={{
          width: '100%',
          padding: 4,
          marginTop: 12,
          backgroundColor: 'white',
        }}
        onPress={handleLogin}>
        <Text style={{}}>Đăng nhập</Text>
      </TouchableOpacity>
      <View
        style={{
          marginTop: 12,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Pressable
          onPress={handleSignInGoogle}
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
