import {useDispatch, useSelector} from 'react-redux';
import {
  addTodayStep,
  setTodaySteps,
  updateTodayActivityIndexes
} from 'src/store/reducer/activitySlice';
import {
  getTodayStepGoalAction,
  updateUserActivityAction
} from 'src/store/reducer/thunks/activityActions';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useState} from 'react';
import {
  getPeriodDistance,
  getPeriodSleep,
  getPeriodSteps,
  observerActivity
} from 'src/config/trackingActivities';
import {DEFAULT_STEP_GOAL} from 'src/constants';
import {
  activityField,
  updateUserActivityRecord
} from 'src/services/firebase/database/activity';
import {activitySelector, userSelector} from 'src/store/selectors';
import {getEndDayISO, getStartDayISO} from 'src/utils/dateTimeHelper';

export const useActivity = () => {
  const dispatch = useDispatch();
  const [isEnabled, setIsEnable] = useState(false);
  const {user} = useSelector(userSelector);
  const {todayProgress} = useSelector(activitySelector);
  //step
  const saveUserTotalSteps = steps => {
    //save total steps to database
    console.log('saveUserTotalSteps', user.uid, steps);
    dispatch(
      updateUserActivityAction({
        userId: user.uid,
        field: activityField.STEPS,
        value: steps
      })
    );
  };

  const handleSaveUserActivityRecords = async activity => {
    console.log('handleSaveUserActivityRecords', activity);
    await updateUserActivityRecord({userId: user.uid, activity});
    dispatch(updateTodayActivityIndexes(activity));
  };
  const handleAddSteps = steps => {
    console.log('handleAddSteps', steps);

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
        observerActivity(
          handleAddSteps,
          saveUserTotalSteps,
          handleSaveUserActivityRecords
        ),

        handleGetTodaySteps(),
        handleGetTodayStepGoal(),
        setDefaultStepTarget()
      ]).catch(error => console.error(error));

      getPeriodSleep();
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
