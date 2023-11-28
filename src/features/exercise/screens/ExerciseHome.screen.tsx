import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Header from '../components/Header';
import PagerView from 'react-native-pager-view';
import Personal from './Personal.screen';

const ExerciseHome = () => {
  return (
    <View style={styles.container}>
      <Header></Header>
      <PagerView scrollEnabled={false} style={styles.pagerView} initialPage={0}>
        <Personal key="1"></Personal>
        <View key="2">
          <Text>Second page</Text>
        </View>
      </PagerView>
    </View>
  );
};

export default ExerciseHome;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  pagerView: {
    flex: 1,
    padding: 12
  }
});
