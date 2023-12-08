import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import React, {useState, useEffect} from 'react';
import ExerciseCardItemScreen from '../components/exercise/ExerciseCardItem';
import {ScrollView} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {setSelectedPlan} from 'src/store/reducer/exerciseSlice';
import CreatePlanModal from '../components/plan/CreatePlanModal';
import {exerciseSelector, userSelector} from 'src/store/selectors';
import {getPlanAction} from 'src/store/reducer/thunks/exerciseActions';
import WeekList from 'src/components/WeekList';
import WorkoutItem from '../components/plan/WorkoutPlanItem';
import {getSpecificDateTimeStamp} from 'src/utils/dateTimeHelper';
import {getHistoryByDate} from 'src/services/firebase/firestore/exercise';
import PlanList from '../components/plan/PlanList';
import Playlist from '../components/playlist/Playlist';
import CreatePlaylistModal from '../components/playlist/CreatePlaylistModal';

const Plan = () => {
  const [createModalShow, setCreateModalShow] = useState(false);
  const [isPlaylistModalShow, setPlaylistModalShow] = useState(false);
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [workoutItemData, setWorkoutItemData] = useState(null);
  const {user} = useSelector(userSelector);
  const {plans, workoutPlan} = useSelector(exerciseSelector);
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<any>();
  const showModal = async () => {
    setCreateModalShow(true);
  };
  console.log(
    'workoutPlan',
    selectedDay,
    workoutPlan[selectedDay],
    workoutPlan
  );
  const navigateToListSongs = () => {
    navigation.navigate('ListSong');
  };
  const onDayItemClick = async i => {
    const now = new Date();
    const startOfWeek = now.getDate() - now.getDay();
    const dayOfWeek = new Date(
      now.getFullYear(),
      now.getMonth(),
      startOfWeek + i
    );
    const timestamp = getSpecificDateTimeStamp(dayOfWeek);
    const data = await getHistoryByDate({userId: user.uid, dateKey: timestamp});

    if (data) {
      setWorkoutItemData(data.detailExercise);
    } else {
      setWorkoutItemData(null);
    }
    console.log('getHistoryByDate', timestamp, data);

    setSelectedDay(i);
  };
  const openCreatePlaylistModal = () => {
    setPlaylistModalShow(true);
  };
  return (
    <ScrollView style={styles.container}>
      <View>
        <Text style={styles.title}>Weekly Workout Plan</Text>
        <WeekList onItemClick={onDayItemClick}></WeekList>
        <WorkoutItem
          planId={workoutPlan[selectedDay]}
          data={workoutItemData}></WorkoutItem>
      </View>

      <Text style={styles.title}>Plan</Text>
      <TouchableOpacity onPress={showModal} style={styles.createPlanWraper}>
        <View style={styles.createPlan}>
          <FontAwesome name={'plus'} color={'black'} size={28}></FontAwesome>
        </View>
        <Text style={styles.createPlanText}>Create new plan</Text>
      </TouchableOpacity>
      <View style={{maxHeight: 220, width: '100%'}}>
        <PlanList></PlanList>
      </View>
      <View style={{flexDirection: 'row'}}>
        <Text style={styles.title}>Playlist</Text>
        <TouchableOpacity
          style={{alignSelf: 'flex-end', padding: 4}}
          onPress={openCreatePlaylistModal}>
          <AntDesign name="plus" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View style={{maxHeight: 220, width: '100%'}}>
        <Playlist></Playlist>
      </View>

      <CreatePlanModal
        visible={createModalShow}
        onClose={() => {
          setCreateModalShow(false);
        }}></CreatePlanModal>
      <CreatePlaylistModal
        visible={isPlaylistModalShow}
        onClose={() => {
          setPlaylistModalShow(false);
        }}></CreatePlaylistModal>
    </ScrollView>
  );
};

export default Plan;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    paddingTop: 0
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    flex: 1
  },
  createPlan: {
    width: 60,
    height: 60,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'gray'
  },
  createPlanText: {
    fontSize: 18,
    marginLeft: 12,
    fontWeight: 'bold'
  },
  createPlanWraper: {
    flexDirection: 'row',
    alignItems: 'center'
  }
});
