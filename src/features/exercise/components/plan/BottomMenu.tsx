import {useState} from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import WeekDateDropDown from 'src/components/WeekDateDropDown';
import {
  removePlanAction,
  updateDailyWorkoutPlanAction,
  updateWorkoutPlanAction
} from 'src/store/reducer/thunks/exerciseActions';
import {userSelector} from 'src/store/selectors';
const BottomMenu = ({visible, onClose, plan}) => {
  const [selectedDate, setSelectedDate] = useState(null);

  const dispatch = useDispatch<any>();
  const {user} = useSelector(userSelector);
  const removePlan = () => {
    dispatch(removePlanAction({userId: user.uid, planName: plan.planName}));
    onClose();
  };

  const handleSetSelectedDate = dateIndex => {
    setSelectedDate(dateIndex);
  };
  const handleAddToWorkoutDaily = () => {
    if (plan.exercise.length > 0) {
      dispatch(
        updateDailyWorkoutPlanAction({
          userId: user.uid,
          planId: plan.id
        })
      );
    }

    onClose();
  };
  const handleAddToWorkoutPlan = () => {
    if (selectedDate != null) {
      dispatch(
        updateWorkoutPlanAction({
          userId: user.uid,
          planId: plan.id,
          id: selectedDate
        })
      );
    }
    onClose();
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end'
          }}>
          <View
            style={{
              backgroundColor: 'black',
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              borderColor: 'white'
            }}>
            <View
              style={{
                height: 12,
                width: 100,
                alignSelf: 'center',
                borderBottomWidth: 2,
                marginBottom: 12
              }}></View>

            <TouchableOpacity
              style={[styles.optionContainer]}
              onPress={removePlan}>
              <Text style={styles.option}>Delete plan</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.optionContainer]}
              onPress={handleAddToWorkoutDaily}>
              <Text style={styles.option}>Repeat daily</Text>
            </TouchableOpacity>

            <View
              style={[
                styles.optionContainer,
                {flexDirection: 'row', alignItems: 'center'}
              ]}>
              <WeekDateDropDown
                onItemSelected={handleSetSelectedDate}></WeekDateDropDown>
              <TouchableOpacity onPress={handleAddToWorkoutPlan}>
                <Text style={styles.option}>Add to workout plan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default BottomMenu;

const styles = StyleSheet.create({
  optionContainer: {
    borderColor: 'gray',
    borderTopWidth: 1,
    justifyContent: 'center',
    paddingVertical: 8,
    width: '100%'
  },
  option: {
    fontWeight: '500',
    textAlign: 'center',
    fontSize: 18,
    color: 'white'
  }
});
