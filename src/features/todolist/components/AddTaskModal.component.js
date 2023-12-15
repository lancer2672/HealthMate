// AddTask.js
import React, {useState} from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  DatePickerAndroid,
  TimePickerAndroid,
  Button
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {format} from 'date-fns';
import {useAppDispatch, useAppSelector} from 'src/store/hooks';
import {userSelector} from 'src/store/selectors';
import {useSelector} from 'react-redux';
import {addTask} from 'src/store/reducer/thunks/todolistActions';

const AddTask = ({isVisible, onClose, onAddTask}) => {
  const dispatch = useAppDispatch();
  const {user} = useSelector(userSelector);

  const [newTask, setNewTask] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    console.log('A date has been picked: ', date);
    setSelectedDate(date);
    hideDatePicker();
  };

  const handleAddTask = () => {
    if (newTask.trim() !== '') {
      onAddTask({
        title: newTask,
        description,
        notificationTime: selectedDate
      });
      dispatch(
        addTask({
          userId: user.uid,
          title: newTask,
          description: description || '',
          createdAt: new Date(),
          notificationTime: selectedDate
        })
      );
      setNewTask('');
      setDescription('');
      setSelectedDate(new Date());
      onClose();
    }
  };

  return (
    <Modal
      transparent
      animationType="slide"
      visible={isVisible}
      onRequestClose={onClose}
      onBackButtonPress={onClose}
      onBackdropPress={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
            <TextInput
              style={[
                styles.input,
                {
                  width: '82%'
                }
              ]}
              placeholder="Task"
              value={newTask}
              onChangeText={text => setNewTask(text)}
              focusable={true}
            />
            <TouchableOpacity
              style={{
                padding: 14,
                borderRadius: 25,
                backgroundColor: 'gray'
              }}
              onPress={handleAddTask}>
              <AntDesign name="arrowup" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Enter description"
            value={description}
            onChangeText={text => setDescription(text)}
          />
          {/* <Button title="Show Date Picker" onPress={showDatePicker} />
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="datetime"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          /> */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              borderRadius: 25,
              borderWidth: 1
            }}>
            <TouchableOpacity
              style={{
                padding: 14,
                borderRadius: 25
              }}
              onPress={showDatePicker}>
              <AntDesign name="calendar" size={24} color="black" />
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="datetime"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
              />
            </TouchableOpacity>
            <Text style={{fontSize: 18, color: 'black'}}>
              {format(selectedDate, 'dd/MM/yyyy, HH:mm')}
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.4)'
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    flexDirection: 'column',
    gap: 10
  },
  input: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 25,
    padding: 14,
    fontSize: 18
  }
});

export default AddTask;
