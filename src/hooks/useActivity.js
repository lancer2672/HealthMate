import {useDispatch, useSelector} from 'react-redux';
import {
  getTodayStepGoalAction,
  updateUserActivityAction
} from 'src/store/reducer/thunks/activityActions';
import {
  updateTodayActivity,
  setTodaySteps,
  addTodayStep
} from 'src/store/reducer/activitySlice';

import {
  observeSteps,
  getPeriodSteps,
  observeCalories,
  getPeriodDistance
} from 'src/config/trackingActivities';
import {activitySelector, userSelector} from 'src/store/selectors';
import {useEffect, useState} from 'react';
import {
  activityField,
  updateUserActivityRecord
} from 'src/services/firebase/database/activity';
import {observeDistance, getTodayDistance} from 'src/config/trackingActivities';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {DEFAULT_STEP_GOAL} from 'src/constants';
import {getEndDayISO, getStartDayISO} from 'src/utils/dateTimeHelper';

export const useActivity = () => {
  const dispatch = useDispatch();
  const [isEnabled, setIsEnable] = useState(false);
  const {user} = useSelector(userSelector);
  //step
  const saveUserTotalSteps = steps => {
    //save steps to database
    dispatch(
      updateUserActivityAction({
        userId: user.uid,
        field: activityField.STEPS,
        value: steps
      })
    );
  };

  const handleSaveUserActivityRecords = async activity => {
    await updateUserActivityRecord({userId: user.uid, activity});
  };
  const handleAddSteps = steps => {
    dispatch(addTodayStep({steps}));
  };

  const handleGetTodaySteps = async () => {
    const startDate = getStartDayISO(new Date());
    const endDate = getEndDayISO(new Date());
    const todaySteps = await getPeriodSteps(startDate, endDate);
    dispatch(setTodaySteps(todaySteps || 0));
  };

  const handleGetTodayStepGoal = async () => {
    dispatch(getTodayStepGoalAction({userId: user.uid}));
  };

  const setDefaultStepTarget = async () => {
    const stepTarget = await AsyncStorage.getItem(DEFAULT_STEP_GOAL);
    if (stepTarget) {
      dispatch(
        updateUserActivityAction({
          userId: user.uid,
          field: 'stepTarget',
          value: JSON.parse(stepTarget)
        })
      );
    }
  };

  const enableActivityTracking = () => {
    setIsEnable(true);
  };
  useEffect(() => {
    if (isEnabled) {
      Promise.all([
        //update user activity records when steps change
        observeSteps(
          handleAddSteps,
          saveUserTotalSteps,
          handleSaveUserActivityRecords
        ),

        handleGetTodaySteps(),
        handleGetTodayStepGoal(),
        setDefaultStepTarget()
      ]).catch(error => console.error(error));

      (async () => {
        const startTime = getStartDayISO(new Date());
        const endTime = getEndDayISO(new Date());
        const distanceRes = await getPeriodDistance(startTime, endTime);

        console.log('distanceRes', distanceRes);
      })();
    }
  }, [isEnabled]);

  return {enableActivityTracking};
};
