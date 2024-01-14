import {useNavigation, useRoute} from '@react-navigation/native';
import {FlatList, Pressable, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {setSelectedPlan} from 'src/store/reducer/exerciseSlice';
import {exerciseSelector, userSelector} from 'src/store/selectors';
import PlanItem from '../PlanItem';

const PlanList = () => {
  const route = useRoute<any>();
  const {user} = useSelector(userSelector);
  const {plans, workoutPlan} = useSelector(exerciseSelector);
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<any>();
  const viewDetailPlan = plan => {
    dispatch(setSelectedPlan(plan));
    navigation.navigate('DetailPlan');
  };
  return (
    <FlatList
      contentContainerStyle={{marginBottom: 20, padding: 6}}
      removeClippedSubviews={false}
      data={plans}
      renderItem={({item}) => (
        <Pressable onPress={() => viewDetailPlan(item)}>
          <PlanItem plan={item} />
        </Pressable>
      )}
    />
  );
};

export default PlanList;

const styles = StyleSheet.create({});
