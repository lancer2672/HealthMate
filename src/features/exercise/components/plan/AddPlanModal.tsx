import {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {FlatList, Modal, TouchableWithoutFeedback} from 'react-native';
import {Button} from 'react-native-paper';
import {useToast} from 'react-native-toast-notifications';
import {useDispatch, useSelector} from 'react-redux';
import InputText from 'src/components/TextInput';
import {addExerciseAction} from 'src/store/reducer/thunks/exerciseActions';
import {exerciseSelector, userSelector} from 'src/store/selectors';
import PlanItem from '../PlanItem';

const AddPlanModal = ({visible, onClose, exercise}) => {
  const [selectedItems, setSelectedItems] = useState({});
  const [duration, setDuration] = useState(0);
  const [breakDuration, setBreakDuration] = useState(0);
  const {plans} = useSelector(exerciseSelector);

  const toast = useToast();
  const {user} = useSelector(userSelector);
  const dispatch = useDispatch<any>();

  const handleAddExercise = () => {
    if (duration > 0) {
      let newEx = {
        ...exercise,
        duration,
        breakDuration
      };
      console.log('selectedPlans', selectedItems, newEx);
      for (let [planId, value] of Object.entries(selectedItems)) {
        //item selected
        if (value == true) {
          dispatch(
            addExerciseAction({
              userId: user.uid,
              planId,
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
      resetForm();
    } else {
      toast.show('You need to set duration', {
        duration: 1000,
        type: 'danger',
        animationType: 'zoom-in'
      });
    }
  };

  const resetForm = () => {
    setDuration(0);
    setBreakDuration(0);
    setSelectedItems({});
  };
  const toggleSelectedItem = planId => {
    setSelectedItems(prev => {
      const newValue = !!prev[planId];
      return {
        ...prev,
        [planId]: !newValue
      };
    });
  };
  const handleClose = () => {
    onClose();
    setBreakDuration(0);
    setDuration(0);
  };
  return (
    <Modal
      animationType="fade"
      transparent={true}
      onRequestClose={handleClose}
      visible={visible}>
      <TouchableWithoutFeedback onPress={null}>
        <View style={{flex: 1}}>
          <View style={{flex: 1}} />

          <View style={styles.subModalContainer}>
            <View style={styles.header}>
              <Text style={styles.modalHeading}>Your plan</Text>
              <TouchableOpacity onPress={handleClose}>
                <AntDesign name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={plans}
              renderItem={({item, index}) => (
                <TouchableOpacity
                  style={{
                    backgroundColor: selectedItems[item.id] ? 'gray' : 'white'
                  }}
                  onPress={() => toggleSelectedItem(item.id)}>
                  <PlanItem isSelected={selectedItems[item.id]} plan={item} />
                </TouchableOpacity>
              )}
              keyExtractor={item => `${item.name}plan`}
            />
            <View style={{flexDirection: 'row'}}>
              <InputText
                style={{flex: 1}}
                keyboardType="numeric"
                onChangeText={setDuration}
                placeholder="Duration"
                value={duration}></InputText>

              <InputText
                style={{flex: 1}}
                keyboardType="numeric"
                onChangeText={setBreakDuration}
                placeholder="Break time"
                value={breakDuration}></InputText>
            </View>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                marginLeft: 6,
                justifyContent: 'flex-end'
              }}>
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
