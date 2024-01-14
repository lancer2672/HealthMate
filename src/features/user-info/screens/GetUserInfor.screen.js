import {useRef, useState} from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import PagerView from 'react-native-pager-view';
import * as Progress from 'react-native-progress';
import {useDispatch, useSelector} from 'react-redux';
import {updateUserInfoAction} from 'src/store/reducer/thunks/userActions';
import {userSelector} from 'src/store/selectors';
import {useTheme} from 'styled-components';
import BodyIndex from '../components/BodyIndex';
import Gender from '../components/Gender';
import Goal from '../components/Goal';
import Lifestyle from '../components/LifeStyle';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function GetUserInfo() {
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState(0);
  const [goal, setGoal] = useState(0);
  const [lifestyle, setLifestyle] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const checkAllFulfilled = () => {
    return age && height && weight && gender && goal;
  };
  const pagerRef = useRef(null);
  const {user} = useSelector(userSelector);
  const dispatch = useDispatch();
  const handleFinish = () => {
    if (checkAllFulfilled()) {
      const newData = {
        age,
        height,
        weight,
        gender,
        goal,
        lifestyle
      };

      dispatch(
        updateUserInfoAction({
          userId: user.uid,
          userData: {...user, ...newData, isGetInformation: true}
        })
      );
    }
  };
  const handleNext = () => {
    if (currentPage < 4) {
      pagerRef.current.setPage(currentPage + 1);
    } else {
      handleFinish();
    }
  };
  const handlePageChange = e => {
    if (e.nativeEvent && e.nativeEvent.position !== undefined) {
      setCurrentPage(e.nativeEvent.position);
    }
  };
  return (
    <View style={{flex: 1}}>
      <Header currentPage={currentPage}></Header>
      <PagerView
        ref={pagerRef}
        style={{flex: 1}}
        initialPage={0}
        onPageSelected={handlePageChange}>
        <BodyIndex
          key={1}
          inputMode="numeric"
          name="How old are you?"
          value={age}
          onNext={handleNext}
          onChange={setAge}
        />
        <BodyIndex
          key={2}
          inputMode="numeric"
          name="What's your height?"
          value={height}
          onNext={handleNext}
          onChange={setHeight}
          afix=" cm"
        />
        <BodyIndex
          key={3}
          inputMode="numeric"
          name="What's your weight?"
          value={weight}
          onNext={handleNext}
          afix=" kg"
          onChange={setWeight}
        />
        <Gender
          key={4}
          value={gender}
          onNext={handleNext}
          onChange={setGender}
        />

        <Lifestyle
          key={5}
          value={lifestyle}
          onNext={handleNext}
          onChange={setLifestyle}></Lifestyle>

        <Goal
          key={6}
          value={goal}
          onNext={handleNext}
          onChange={setGoal}></Goal>
      </PagerView>
    </View>
  );
}
const Header = ({currentPage}) => {
  const theme = useTheme();
  return (
    <View style={{paddingBottom: 2}}>
      <View style={[styles.header]}>
        <Text style={styles.title}>Step {currentPage + 1} of 6</Text>
      </View>
      <Progress.Bar
        progress={(currentPage + 1) / 6}
        width={SCREEN_WIDTH}
        borderWidth={0} // Bỏ border
        color={'orange'} // Màu cam cho phần đã tiến triển
        unfilledColor={'#c9c9c9'} // Màu xám cho phần chưa tiến triển
        style={{margin: 'auto'}}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  title: {
    fontSize: 32,
    fontWeight: '500',
    marginLeft: 12,
    color: 'black'
  },
  header: {
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12
    // width: '100%',
  }
});
