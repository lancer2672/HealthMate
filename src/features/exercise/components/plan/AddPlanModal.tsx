import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Pressable
} from 'react-native';
import React, {useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {TouchableWithoutFeedback, FlatList, Modal} from 'react-native';
import PlanItem from '../PlanItem';
import {Button} from 'react-native-paper';
import {useToast} from 'react-native-toast-notifications';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {useDispatch, useSelector} from 'react-redux';
import {exerciseSelector, userSelector} from 'src/store/selectors';
import {addExerciseAction} from 'src/store/reducer/thunks/exerciseActions';
import InputText from 'src/components/TextInput';

const AddPlanModal = ({visible, onClose, exercise}) => {
  const [selectedItems, setSelectedItems] = useState({});
  const [duration, setDuration] = useState(0);
  const {plans} = useSelector(exerciseSelector);

  const toast = useToast();
  const {user} = useSelector(userSelector);
  const dispatch = useDispatch<any>();

  const handleAddExercise = () => {
    if (duration > 0) {
      let newEx = {
        ...exercise,
        duration
      };
      console.log('selectedPlans', selectedItems);
      for (let [planName, value] of Object.entries(selectedItems)) {
        //item selected
        if (value == true) {
          dispatch(
            addExerciseAction({
              userId: user.uid,
              planName,
              exercise: newEx
            })
          );
        }
      }

      onClose();
      toast.show('Success', {
        duration: 1000,
        type: 'success',
        animationType: 'zoom-in'
      });
      setDuration(0);
    } else {
      toast.show('You need to set duration', {
        duration: 1000,
        type: 'danger',
        animationType: 'zoom-in'
      });
    }
  };

  const toggleSelectedItem = planName => {
    setSelectedItems(prev => {
      const newValue = !!prev[planName];
      return {
        ...prev,
        [planName]: !newValue
      };
    });
  };
  return (
    <Modal
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
      visible={visible}>
      <TouchableWithoutFeedback onPress={null}>
        <View style={{flex: 1}}>
          <View style={{flex: 1}} />

          <View style={styles.subModalContainer}>
            <View style={styles.header}>
              <Text style={styles.modalHeading}>Your plan</Text>
              <TouchableOpacity onPress={onClose}>
                <AntDesign name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={plans}
              renderItem={({item, index}) => (
                <TouchableOpacity
                  style={{
                    backgroundColor: selectedItems[item.planName]
                      ? 'gray'
                      : 'white'
                  }}
                  onPress={() => toggleSelectedItem(item.planName)}>
                  <PlanItem
                    isSelected={selectedItems[item.planName]}
                    plan={item}
                  />
                </TouchableOpacity>
              )}
              keyExtractor={item => `${item.name}plan`}
            />
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                marginLeft: 6,
                justifyContent: 'space-between'
              }}>
              {/* <TextInput
                style={styles.input}
                keyboardType="numeric"
                onChangeText={setDuration}
                placeholder="Duration"
                value={duration}
              /> */}
              <InputText
                keyboardType="numeric"
                onChangeText={setDuration}
                placeholder="Duration"
                value={duration}></InputText>
              {/* <View style={styles.inputContainer}>
                <Text style={styles.suffix}>seconds</Text>
              </View> */}

              <Button
                style={styles.button}
                mode="contained"
                onPress={handleAddExercise}>
                Add
              </Button>
            </View>
          </View>

          <View style={{flex: 1.2}} />
        </View>
      </TouchableWithoutFeedback>
      {/* <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="time"
        locale="en_GB"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      /> */}
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft: 26,
    flex: 1
  },
  header: {
    flexDirection: 'row',
    marginHorizontal: 12,
    paddingBottom: 12
  },
  button: {
    borderRadius: 4,
    borderWidth: 2,
    margin: 12,
    alignSelf: 'flex-end',
    borderColor: 'black',
    backgroundColor: 'black'
  },
  textInput: {
    flex: 1
  },
  container: {
    position: 'absolute',
    bottom: 0,
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
    backgroundColor: 'white',
    right: 0,
    padding: 8,
    left: 0
  },
  option: {
    marginLeft: 12,
    fontSize: 16
  },
  playlistItemContainer: {
    height: 70,
    backgroundColor: '#101010',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    width: 280,
    padding: 12,
    margin: 12
  },
  subModalContainer: {
    backgroundColor: 'white',
    borderColor: 'gray',
    borderWidth: 1,
    elevation: 2,
    justifyContent: 'center',
    paddingTop: 12,
    alignItems: 'center',
    height: 400,
    marginHorizontal: 24,
    borderRadius: 4
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  input: {
    flex: 1,
    padding: 4
  },
  suffix: {
    marginLeft: 5
  }
});

export default AddPlanModal;
