import {useNavigation, useRoute} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {Button} from 'react-native-paper';
import {useSelector} from 'react-redux';
import buttonStyles from 'src/features/theme/styles/button';
import audioServiceIns from 'src/services/audio/audioIns';
import {addPoint} from 'src/services/firebase/database/group';
import {exerciseSelector, userSelector} from 'src/store/selectors';
import {useTheme} from 'styled-components';

const FinishScreen = () => {
  const route = useRoute<any>();
  const {user} = useSelector(userSelector);
  const navigation = useNavigation<any>();
  const theme = useTheme();
  const [isPlaying, setIsPlaying] = useState(true);
  const {doExercise} = useSelector(exerciseSelector);

  console.log('doExercise', doExercise);
  const getTotalDuration = () => {
    const res = doExercise.reduce((acc, item) => {
      return acc + item.duration || 0;
    }, 0);
    return res;
  };
  const getTotalBreakDuration = () => {
    const res = doExercise.reduce((acc, item) => {
      return acc + item.breakDuration;
    }, 0);
    return res;
  };
  const navigationToHome = () => {
    navigation.replace('AppTabs', {screen: 'Home'});
  };
  const handleShareResult = async () => {};
  useEffect(() => {
    if (user.groupId) {
      const point = getTotalDuration();
      addPoint({userId: user.uid, groupId: user.groupId, point});
    }
  }, [user.groupId]);
  useEffect(() => {
    audioServiceIns.stop();
  }, []);
  return (
    <View style={{flex: 1}}>
      <View style={{flex: 1, alignItems: 'center'}}>
        <Image
          source={require('../../../assets/imgs/bicep.jpg')}
          style={{width: '100%', height: '100%'}}></Image>
        <Text>FinishScreen</Text>
      </View>
      <View
        style={{
          flex: 2.5,
          elevation: 1,
          paddingVertical: 12,
          alignItems: 'center',
          backgroundColor: 'black',
          width: '100%'
        }}>
        <Text style={[styles.time, {marginVertical: 12, color: theme.success}]}>
          Congratulations
        </Text>
        <Text
          style={[
            {
              marginVertical: 2,
              fontSize: 20,
              color: theme.green3,
              fontWeight: '400'
            }
          ]}>
          You've achieved today goal!!
        </Text>
        <View style={styles.modal}>
          <View style={styles.centered}>
            <Text style={[styles.title, {color: theme.green2}]}>
              {doExercise.length} Exercise
            </Text>
            <Text style={[styles.subTitle, {color: theme.green1}]}>
              {getTotalDuration()} seconds{' '}
            </Text>
          </View>
          <View style={styles.separator}></View>
          <View style={styles.centered}>
            <Text style={[styles.title, {color: theme.green2}]}>
              Break duration
            </Text>
            <Text style={[styles.subTitle, {color: theme.green1}]}>
              {getTotalBreakDuration()} seconds{' '}
            </Text>
          </View>
        </View>
        <View>
          <Button
            style={[buttonStyles.primary, styles.btn(theme)]}
            mode="contained"
            onPress={navigationToHome}>
            Finish
          </Button>
          <Button
            style={[buttonStyles.primary, styles.btn(theme)]}
            mode="contained"
            onPress={handleShareResult}>
            Share to group
          </Button>
        </View>
      </View>
    </View>
  );
};

export default FinishScreen;

const styles = StyleSheet.create({
  modal: {
    elevation: 1,
    flexDirection: 'row',
    width: '100%',
    height: 120,
    margin: 24,
    padding: 8,

    justifyContent: 'space-between'
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  separator: {
    height: '100%',
    width: 4,
    backgroundColor: 'white',
    borderRadius: 2,
    opacity: 0.5
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20
  },
  btn: theme => ({
    width: 200,
    backgroundColor: theme.green1,
    borderColor: theme.green1,
    alignSelf: 'center'
  }),
  subTitle: {
    // fontWeight: 'bold',
    fontSize: 16
  },
  time: {
    fontSize: 36,
    fontWeight: 'bold'
  }
});
