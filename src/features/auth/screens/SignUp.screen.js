import {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import {userSelector} from 'src/store/selectors';
import logoHealthMate from '../../../assets/imgs/LogoHealthMate.png';
import {register} from '../../../store/reducer/thunks/userActions';
import {accountSchema, handleValidateField} from '../../../utils/validation';
import InputText from '../components/InputText.component';

export default function Register({navigation}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const {user, success, isLoading} = useSelector(userSelector);
  const refInputName = useRef();
  const refInputEmail = useRef();
  const refInputNewPassword = useRef();
  const refInputConfirmNewPassword = useRef();

  const dispatch = useDispatch();

  const handleRegister = async () => {
    if (name || email || newPassword) {
      dispatch(register({email, password: newPassword, name}));
    }
  };
  const navigateToLoginScreen = () => {
    // setError(null);
    navigation.navigate('Login', {});
  };
  useEffect(() => {
    if (!isLoading && success) {
      navigateToLoginScreen();
    }
  }, [success, isLoading]);
  return (
    <View style={[styles.container, {opacity: isLoading ? 0.8 : 1}]}>
      {isLoading && (
        <ActivityIndicator
          style={StyleSheet.absoluteFillObject}
          size="large"
          color="#0000ff"
        />
      )}
      <Image source={logoHealthMate} style={{width: 250, height: 250}} />
      <View style={{flexDirection: 'column', alignItems: 'center', gap: 2}}>
        <InputText
          ref={refInputName}
          iconLeft={'account'}
          setText={setName}
          hasValidationError={validationErrors.name}
          placeholder={'Họ và tên'}
          onBlur={() =>
            handleValidateField(
              accountSchema,
              'name',
              name,
              validationErrors,
              setValidationErrors
            )
          }></InputText>
        {validationErrors.name && (
          <Text style={styles.error}>{validationErrors.name}</Text>
        )}

        <InputText
          ref={refInputEmail}
          iconLeft={'email'}
          setText={setEmail}
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
          ref={refInputNewPassword}
          iconLeft={'lock'}
          passwordType
          hasValidationError={validationErrors.newPassword}
          setText={setNewPassword}
          onBlur={() =>
            handleValidateField(
              accountSchema,
              'newPassword',
              newPassword,
              validationErrors,
              setValidationErrors
            )
          }
          placeholder={'Mật khẩu'}></InputText>
        {validationErrors.newPassword && (
          <Text style={styles.error}>{validationErrors.newPassword}</Text>
        )}

        <InputText
          ref={refInputConfirmNewPassword}
          iconLeft={'lock'}
          passwordType
          hasValidationError={validationErrors.confirmNewPassword}
          setText={setConfirmNewPassword}
          onBlur={() =>
            handleValidateField(
              accountSchema,
              'confirmNewPassword',
              confirmNewPassword,
              validationErrors,
              setValidationErrors,
              {newPassword}
            )
          }
          placeholder={'Nhập lại mật khẩu'}></InputText>
        {validationErrors.confirmNewPassword && (
          <Text style={styles.error}>
            {validationErrors.confirmNewPassword}
          </Text>
        )}
      </View>

      <TouchableOpacity style={styles.btnSignUp} onPress={handleRegister}>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 16,
            fontWeight: 'bold',
            color: 'white'
          }}>
          Đăng ký
        </Text>
      </TouchableOpacity>

      <View
        style={{
          marginTop: 12,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
        <Text style={{fontSize: 16, color: 'black'}}>Bạn đã có tài khoản?</Text>
        <TouchableOpacity onPress={navigateToLoginScreen}>
          <Text
            style={{
              marginLeft: 2,
              fontWeight: '500',
              fontSize: 16,
              color: '#01819E'
            }}>
            Đăng nhập ngay
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  btnSignUp: {
    width: '30%',
    marginTop: 15,
    marginBottom: 10,
    padding: 12,
    borderRadius: 25,
    backgroundColor: '#01819E'
  }
});
