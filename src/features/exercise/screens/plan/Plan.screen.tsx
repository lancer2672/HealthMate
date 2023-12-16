import {useEffect, useMemo, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {ScrollView} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import WeekList from 'src/components/WeekList';
import {getHistoryByDate} from 'src/services/firebase/firestore/exercise';
import {exerciseSelector, userSelector} from 'src/store/selectors';
import {
  convertSecondsToMinutesAndSeconds,
  getSpecificDateTimeStamp
} from 'src/utils/dateTimeHelper';
import CreatePlanModal from '../../components/plan/CreatePlanModal';
import PlanList from '../../components/plan/PlanList';
import WorkoutItem from '../../components/plan/WorkoutPlanItem';
import CreatePlaylistModal from '../../components/playlist/CreatePlaylistModal';
import Playlist from '../../components/playlist/Playlist';

const Plan = () => {
  const [createModalShow, setCreateModalShow] = useState(false);
  const [isPlaylistModalShow, setPlaylistModalShow] = useState(false);
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [workoutItemData, setWorkoutItemData] = useState(null);
  const [monthData, setMonthData] = useState([]);
  const {user} = useSelector(userSelector);
  const {plans, doExercise, workoutPlan} = useSelector(exerciseSelector);
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<any>();
  const showModal = async () => {
    setCreateModalShow(true);
  };

  const navigateToListSongs = () => {
    navigation.navigate('ListSong');
  };

  const onDayItemClick = async i => {
    const data = await fetchWorkoutData(i);

    if (data) {
      setWorkoutItemData(data.detailExercise);
    } else {
      setWorkoutItemData(null);
    }

    setSelectedDay(i);
  };
  const openCreatePlaylistModal = () => {
    setPlaylistModalShow(true);
  };

  const fetchWorkoutData = async i => {
    const now = new Date();
    const startOfWeek = now.getDate() - now.getDay();
    const dayOfWeek = new Date(
      now.getFullYear(),
      now.getMonth(),
      startOfWeek + i
    );
    const timestamp = getSpecificDateTimeStamp(dayOfWeek);
    const data = await getHistoryByDate({userId: user.uid, dateKey: timestamp});

    return data;
  };
  const fetchWorkoutDataForMonth = async (year, month) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const data = await Promise.all(
      Array.from({length: daysInMonth}, async (_, i) => {
        const date = new Date(year, month, i + 1);
        const timestamp = getSpecificDateTimeStamp(date);

        return await getHistoryByDate({userId: user.uid, dateKey: timestamp});
      })
    );

    return data
      .map((d, i) => {
        if (!d) return null;
        return {
          date: i,
          ...d
        };
      })
      .filter(d => d != null);
  };
  const viewDetailHistory = () => {};

  useEffect(() => {
    (async () => {
      const date = new Date();
      const currentMonthData = await fetchWorkoutDataForMonth(
        date.getFullYear(),
        date.getMonth()
      );
      console.log('fetchWorkoutDataForMonth', currentMonthData);
      setMonthData(currentMonthData);
      const data = await fetchWorkoutData(new Date().getDay());
      if (data) {
        setWorkoutItemData(data.detailExercise);
      }
    })();
  }, [doExercise]);
  const monthStatisticData = useMemo(() => {
    let totalExercise = 0;
    let totalDuration = 0;
    let totalBreakDuration = 0;

    monthData.forEach(item => {
      item.detailExercise.forEach(exercise => {
        totalExercise += 1;
        totalDuration += exercise.duration;
        totalBreakDuration += exercise.breakDuration;
      });
    });

    return {totalExercise, totalDuration, totalBreakDuration};
  }, [monthData]);

  return (
    <ScrollView style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
        <View style={{flex: 1}}>
          <Text style={styles.date}>{moment().format('MMM YYYY')}</Text>
        </View>
        <TouchableOpacity onPress={viewDetailHistory} style={{}}>
          <Text style={styles.viewAll}>View all</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.streak}>
        <View style={styles.streakItem}>
          <Ionicons name="fitness" size={24} color="black" />
          <Text style={styles.streakText}>
            {monthStatisticData.totalExercise} exercise
          </Text>
        </View>
        <View style={styles.streakItem}>
          <AntDesign name="clockcircle" size={24} color="black" />
          <Text style={styles.streakText}>
            {convertSecondsToMinutesAndSeconds(
              monthStatisticData.totalDuration
            )}{' '}
          </Text>
        </View>
        {/* <View style={styles.streakItem}>
          <AntDesign name="clockcircle" size={24} color="black" />
          <Text style={styles.streakText}>Total exercise</Text>
        </View> */}
      </View>
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
  streak: {flexDirection: 'row', justifyContent: 'space-evenly'},
  streakItem: {alignItems: 'center', paddingVertical: 4},
  streakText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    flex: 1
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    flex: 1
  },
  viewAll: {
    color: 'gray'
  },
  date: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'gray'
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
