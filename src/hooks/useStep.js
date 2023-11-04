import {useDispatch, useSelector} from 'react-redux';
import {updateTotalStepsAction, addTodaySteps, setDailySteps} from './actions'; // Import your actions
import {getTodaySteps} from 'src/config/trackingActivities';
import {userSelector} from 'src/store/selectors';

export const useSteps = () => {
  const dispatch = useDispatch();
  const {user} = useSelector(userSelector);

  const handleUpdateTotalSteps = steps => {
    dispatch(updateTotalStepsAction({userId: user.uid, steps}));
  };

  const handleAddSteps = steps => {
    dispatch(addTodaySteps(steps));
  };

  const handleGetTodaySteps = async () => {
    const todaySteps = await getTodaySteps();
    dispatch(setDailySteps(todaySteps || 0));
  };

  return {handleUpdateTotalSteps, handleAddSteps, handleGetTodaySteps};
};
