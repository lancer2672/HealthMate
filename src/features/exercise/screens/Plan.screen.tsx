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

const Plan = () => {
  const [plans, setPlans] = useState<PlanType[]>();
  const createPlan = async () => {};
  const viewDetailPlan = () => {};
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Your plan</Text>
      <TouchableOpacity onPress={createPlan} style={styles.createPlanWraper}>
        <View style={styles.createPlan}>
          <FontAwesome name={'plus'} color={'black'} size={28}></FontAwesome>
        </View>
        <Text style={styles.createPlanText}>Create new plan</Text>
      </TouchableOpacity>
      <View style={{maxHeight: 220, width: '100%'}}>
        <FlatList
          contentContainerStyle={{marginBottom: 20}}
          removeClippedSubviews={false}
          data={[
            {
              name: 'new name',
              exercise: [],
              createdAt: new Date()
            },
            {
              name: 'new name',
              exercise: [],
              createdAt: new Date()
            },
            {
              name: 'new name',
              exercise: [],
              createdAt: new Date()
            },
            {
              name: 'new name',
              exercise: [],
              createdAt: new Date()
            },
            {
              name: 'new name',
              exercise: [],
              createdAt: new Date()
            },
            {
              name: 'new name',
              exercise: [],
              createdAt: new Date()
            }
          ]}
          renderItem={({item}) => (
            <Pressable onPress={viewDetailPlan}>
              <PlanItem plan={item} />
            </Pressable>
          )}
        />
      </View>
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
