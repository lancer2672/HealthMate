import {Image, StyleSheet, TouchableOpacity, Text, View} from 'react-native';
import React, {useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Button} from 'react-native-paper';
import buttonStyles from 'src/features/theme/styles/button';
import PlanListModal from '../components/plan/AddPlanModal';
import {useTheme} from 'styled-components';

const DetailExercise = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const theme = useTheme();
  const [isShowPlanList, setIsShowPlanList] = useState(false);

  const {exercise} = route.params;
  const navigateBack = () => {
    navigation.goBack();
  };
  const handleAddSongToPlaylist = () => {};
  const openPlanList = () => {
    setIsShowPlanList(true);
  };
  return (
    <>
      <View style={{paddingBottom: 2}}>
        <View style={[styles.header, {backgroundColor: theme.secondary}]}>
          <TouchableOpacity onPress={navigateBack}>
            <Ionicons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>List exercise</Text>
        </View>
      </View>
      <View style={styles.container}>
        <Text style={styles.name}>{exercise.name}</Text>
        <Image source={{uri: exercise.gifUrl}} style={styles.img}></Image>
        <View>
          {exercise.instructions.map((instruction, i) => {
            return (
              <Text key={`instruction${i}`} style={styles.instruction}>
                {i} - {instruction}
              </Text>
            );
          })}
        </View>
        <Button
          style={buttonStyles.primary}
          mode="contained"
          onPress={openPlanList}>
          Add to plan
        </Button>
      </View>
      <PlanListModal
        visible={isShowPlanList}
        onClose={() => {
          setIsShowPlanList(false);
        }}></PlanListModal>
    </>
  );
};

export default DetailExercise;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',

    padding: 12
  },
  title: {
    fontSize: 32,
    fontWeight: '500',
    marginLeft: 12,

    color: 'white'
  },
  header: {
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12
    // width: '100%',
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold'
  },
  img: {width: 100, height: 100},
  instruction: {
    marginTop: 4,
    fontSize: 15
  }
});
