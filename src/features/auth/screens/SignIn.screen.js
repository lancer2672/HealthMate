import {
  View,
  Text,
  Keyboard,
  Pressable,
  TouchableOpacity,
  Image,
  StyleSheet
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {
  GoogleSignin,
  statusCodes
} from '@react-native-google-signin/google-signin';
import InputText from '../components/InputText.component';
import {accountSchema, handleValidateField} from '../../../utils/validation';
import {setIsLoading} from '../../../store/reducer/appSlice';
import {login} from '../../../store/reducer/thunks/userActions';
import logoHealthMate from '../../../assets/imgs/LogoHealthMate.png';
import SignUp from './SignUp.screen';
import {WEB_API_KEY} from '@env';

GoogleSignin.configure({
  webClientId: WEB_API_KEY,
  offlineAccess: true
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
    refInputName.current.blur();
    refInputPassword.current.blur();
    // console.log(Object.keys(validationErrors).length);
    // if (Object.keys(validationErrors).length == 0) {
    //   const data = login({email, password});
    //   console.log('data', data);
    // }
    console.log('email1', email);
    if (email !== '' || password !== '') {
      dispatch(login({email, password}));
    }
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
    navigation.navigate('Register', {});
  };
  return (
    <View style={styles.container}>
      <Image source={logoHealthMate} style={{width: 250, height: 250}} />
      <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            marginBottom: 10,
            color: 'black'
          }}>
          Chào mừng!
        </Text>
      </View>
      <View style={{flexDirection: 'column', alignItems: 'center', gap: 2}}>
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
              setValidationErrors
            )
          }></InputText>
        {validationErrors.email && (
          <Text style={styles.error}>{validationErrors.email}</Text>
        )}

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
              setValidationErrors
            )
          }
          placeholder={'Mật khẩu'}></InputText>
        {validationErrors.password && (
          <Text style={styles.error}>{validationErrors.password}</Text>
        )}
      </View>

      <View
        style={{
          marginTop: 10,
          width: '65%',
          flexDirection: 'row',
          justifyContent: 'flex-end'
        }}>
        <TouchableOpacity onPress={handleSendEmailResetPassword}>
          <Text style={{fontSize: 16, color: '#01819E'}}>Quên mật khẩu?</Text>
        </TouchableOpacity>
      </View>

      {error && (
        <Text style={styles.error}>
          Tên đăng nhập hoặc mật khẩu không hợp lệ
        </Text>
      )}
      <TouchableOpacity style={styles.btnLogin} onPress={handleLogin}>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 16,
            fontWeight: 'bold',
            color: 'white'
          }}>
          Đăng nhập
        </Text>
      </TouchableOpacity>

      <View
        style={{
          marginTop: 12,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
        <Text style={{fontSize: 16, color: 'black'}}>
          Bạn chưa có tài khoản?
        </Text>
        <TouchableOpacity onPress={navigateToRegister1Screen}>
          <Text
            style={{
              marginLeft: 2,
              fontWeight: '500',
              fontSize: 16,
              color: '#01819E'
            }}>
            Đăng ký
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          marginTop: 12,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
        <Pressable
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white'
          }}
          onPress={handleSignInGoogle}>
          <Image
            resizeMode="contain"
            style={styles.logo}
            source={require('../../../assets/icons/google_icon.png')}
          />
          <Text
            style={{
              color: 'black',
              fontSize: 16,
              marginLeft: 3
            }}>
            Đăng nhập với Google
          </Text>
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
    backgroundColor: 'white'
  },
  error: {
    color: 'red'
  },
  logo: {
    width: 32,
    height: 32
    // marginLeft: 8,
  },
  google: {
    width: '60%',
    height: 42,
    borderRadius: 25
    // elevation: 2,
  },
  fb: {
    width: 50,
    height: 50,
    borderRadius: 25,
    elevation: 2
  },
  btnLogin: {
    width: '30%',
    marginTop: 15,
    marginBottom: 10,
    padding: 12,
    borderRadius: 25,
    backgroundColor: '#01819E'
  }
});
export default Login;
