import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import React, {useState, useEffect} from 'react';
import ExerciseCardItemScreen from '../components/list/ExerciseCardItem';
import {ScrollView} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import PlanItem from '../components/PlanItem';
import {PlanType} from 'src/types/plan.type';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {setSelectedPlan} from 'src/store/reducer/exerciseSlice';
import CreatePlanModal from '../components/plan/CreatePlanModal';
import {exerciseSelector, userSelector} from 'src/store/selectors';
import {getPlanAction} from 'src/store/reducer/thunks/exerciseActions';

const Plan = () => {
  const [createModalShow, setCreateModalShow] = useState(false);
  const {user} = useSelector(userSelector);
  const {plans} = useSelector(exerciseSelector);
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<any>();
  const showModal = async () => {
    setCreateModalShow(true);
  };
  console.log('Plan', plans);
  const viewDetailPlan = plan => {
    dispatch(setSelectedPlan(plan));
    navigation.navigate('DetailPlan');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Your plan</Text>
      <TouchableOpacity onPress={showModal} style={styles.createPlanWraper}>
        <View style={styles.createPlan}>
          <FontAwesome name={'plus'} color={'black'} size={28}></FontAwesome>
        </View>
        <Text style={styles.createPlanText}>Create new plan</Text>
      </TouchableOpacity>
      <View style={{maxHeight: 220, width: '100%'}}>
        <FlatList
          contentContainerStyle={{marginBottom: 20}}
          removeClippedSubviews={false}
          data={plans}
          renderItem={({item}) => (
            <Pressable onPress={() => viewDetailPlan(item)}>
              <PlanItem plan={item} />
            </Pressable>
          )}
        />
      </View>
      <CreatePlanModal
        visible={createModalShow}
        onClose={() => {
          setCreateModalShow(false);
        }}></CreatePlanModal>
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
    marginBottom: 4
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
