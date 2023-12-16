import {useCallback, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {PLAN_TYPES} from 'src/constants';
import {getGroupPlan} from 'src/services/firebase/database/group';
import {exerciseSelector, userSelector} from 'src/store/selectors';

function usePlans() {
  const {workoutPlan, plans} = useSelector(exerciseSelector);
  const {user} = useSelector(userSelector);
  const [todayPlan, setTodayPlan] = useState();
  const [groupPlan, setGroupPlan] = useState();

  useEffect(() => {
    if (workoutPlan) {
      const today = new Date().getDay();
      const todayWorkoutPlan = plans.find(p => p.id === workoutPlan[today]);
      console.log('workoutPlan', todayWorkoutPlan, today);
      setTodayPlan({
        ...todayWorkoutPlan,
        isRecommendedPlan: true,
        type: PLAN_TYPES.TODAY
      });
    }
  }, [workoutPlan]);

  const handleGetGroupPlan = useCallback(async () => {
    if (user && user.groupId) {
      const plan = await getGroupPlan({groupId: user.groupId});
      if (plan) {
        console.log('handleGetGroupPlan', plan);
        setGroupPlan({
          ...plan,
          isRecommendedPlan: true,
          type: PLAN_TYPES.GROUP
        });
      }
    }
  }, [user]);

  useEffect(() => {
    handleGetGroupPlan();
  }, [handleGetGroupPlan]);

  return {todayPlan, groupPlan};
}

export default usePlans;
