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
import {useCallback, useEffect, useState} from 'react';
import {getPeriodSteps, observerActivity} from 'src/config/trackingActivities';
import {DEFAULT_STEP_GOAL} from 'src/constants';
import {
  activityField,
  observeTodaySavedActivity,
  updateUserActivityRecord
} from 'src/services/firebase/database/activity';
import {activitySelector, userSelector} from 'src/store/selectors';
import {getEndDayISO, getStartDayISO} from 'src/utils/dateTimeHelper';

export const calculateStepCalorie = (user, moveMins) => {
  const stepMET = 3.5;
  const calorie = ((stepMET * 3.5 * user.weight) / 200) * moveMins;
  return calorie;
};
export const useActivity = () => {
  const dispatch = useDispatch();
  const {user} = useSelector(userSelector);
  const {todayProgress} = useSelector(activitySelector);
  const [isEnabled, setIsEnable] = useState(false);
  const [stepCalorie, setStepCalorie] = useState(0);

  // const calculateStepCalorie = useCallback(
  //   moveMins => {
  //     const stepMET = 3.5;
  //     const calorie = ((stepMET * 3.5 * user.weight) / 200) * moveMins;
  //     setStepCalorie(() => calorie);
  //   },
  //   [user]
  // );
  console.log('stepcalorie', stepCalorie);
  const saveUserTotalSteps = useCallback(
    steps => {
      dispatch(
        updateUserActivityAction({
          userId: user.uid,
          field: activityField.STEPS,
          value: steps
        })
      );
    },
    [dispatch, user]
  );

  const handleSaveUserActivityRecords = useCallback(
    async activity => {
      await updateUserActivityRecord({userId: user.uid, activity});
      dispatch(updateTodayActivityIndexes(activity));
    },
    [dispatch, user]
  );

  const handleAddSteps = useCallback(
    steps => {
      dispatch(addTodayStep({steps}));
    },
    [dispatch]
  );

  const handleGetTodaySteps = useCallback(async () => {
    const startDate = getStartDayISO(new Date());
    const endDate = getEndDayISO(new Date());
    const todaySteps = await getPeriodSteps(startDate, endDate);
    dispatch(setTodaySteps(todaySteps || 0));
  }, [dispatch]);

  const handleGetTodayStepGoal = useCallback(() => {
    dispatch(getTodayStepGoalAction({userId: user.uid}));
  }, [dispatch, user]);

  const setDefaultStepTarget = useCallback(async () => {
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
  }, [dispatch, user]);

  const enableActivityTracking = useCallback(() => {
    setIsEnable(true);
  }, []);

  useEffect(() => {
    if (user) {
      const onChange = activity => {
        // console.log('onChange', activity);
        const calorie = calculateStepCalorie(user, activity.moveMins);
        setStepCalorie(calorie);
      };
      observeTodaySavedActivity({userId: user.uid, onActivityUpdate: onChange});
    }
  }, [user]);
  useEffect(() => {
    if (isEnabled) {
      Promise.all([
        observerActivity(
          handleAddSteps,
          saveUserTotalSteps,
          handleSaveUserActivityRecords
        ),
        handleGetTodaySteps(),
        handleGetTodayStepGoal(),
        setDefaultStepTarget()
      ]).catch(error => console.error(error));
    }
  }, [
    isEnabled,
    user,
    handleAddSteps,
    saveUserTotalSteps,
    handleSaveUserActivityRecords,
    calculateStepCalorie,
    handleGetTodaySteps,
    handleGetTodayStepGoal,
    setDefaultStepTarget
  ]);

  return {stepCalorie, enableActivityTracking};
};
