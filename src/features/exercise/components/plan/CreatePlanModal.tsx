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
import {addPlanAction} from 'src/store/reducer/thunks/exerciseActions';
import {exerciseSelector, userSelector} from 'src/store/selectors';

const CreatePlanModal = ({visible, onClose}) => {
  const [planName, setPlanName] = useState('');
  const toast = useToast();
  const dispatch = useDispatch<any>();
  const {user} = useSelector(userSelector);
  const {error} = useSelector(exerciseSelector);

  const handleAddNewPlan = () => {
    dispatch(
      addPlanAction({
        userId: user.uid,
        plan: {planName, exercise: [], createdAt: new Date()}
      })
    );
    setPlanName('');
    onClose();
  };
  React.useEffect(() => {
    if (error) {
      toast.show(error, {type: 'danger'});
    }
  }, [error]);
  return (
    <Modal
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
      visible={visible}>
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          backgroundColor: 'rgba(0, 0, 0, 0.5)'
        }}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={{flex: 1}}></View>
        </TouchableWithoutFeedback>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.modalHeading}>Create plan</Text>
            <TouchableOpacity onPress={onClose}>
              <AntDesign name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              marginLeft: 6,
              justifyContent: 'space-between'
            }}>
            <TextInput
              style={styles.textInput}
              onChangeText={setPlanName}
              placeholder="Your plan name"
              value={planName}
            />
          </View>
          <Button
            style={styles.button}
            mode="contained"
            onPress={handleAddNewPlan}>
            Add
          </Button>
        </View>
      </View>
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
  container: {
    backgroundColor: 'white',
    borderColor: 'gray',
    marginTop: 'auto',
    borderWidth: 1,
    elevation: 2,
    justifyContent: 'center',
    paddingTop: 12,
    alignItems: 'center',
    borderRadius: 12
  }
});

export default CreatePlanModal;
