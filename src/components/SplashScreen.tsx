import {Image, StyleSheet, View} from 'react-native';
import logoHealthMate from '../assets/imgs/LogoHealthMate.png';
const SplashScreen = () => {
  return (
    <View style={styles.image}>
      <Image style={{width: 280, height: 280}} source={logoHealthMate}></Image>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  image: {
    resizeMode: 'cover',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
