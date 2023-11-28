import {StyleSheet, Text, View} from 'react-native';
import React, {useRef} from 'react';
import Header from '../components/Header';
import PagerView from 'react-native-pager-view';
import Personal from './Personal.screen';
import TabButton from '../components/TabButton';

const ExerciseHome = () => {
  const pageViewRef = useRef<PagerView>();

  const onButtonClick = (index: number) => {
    pageViewRef.current.setPageWithoutAnimation(index);
  };
  return (
    <View style={styles.container}>
      <Header></Header>
      <TabButton onButtonClick={onButtonClick}></TabButton>
      <PagerView
        ref={pageViewRef}
        scrollEnabled={false}
        style={styles.pagerView}
        initialPage={0}>
        <Personal key="0"></Personal>
        <View key="1">
          <Text>Second page</Text>
        </View>
      </PagerView>
    </View>
  );
};

export default ExerciseHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  pagerView: {
    flex: 1,
    padding: 12
  }
});
