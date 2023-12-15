import {
  View,
  Text,
  Keyboard,
  Pressable,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  FlatList,
  ScrollView
} from 'react-native';
import React, {useEffect, useState, useReducer} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AddTask from '../components/AddTaskModal.component';
import {useAppDispatch, useAppSelector} from 'src/store/hooks';
import {userSelector, todolistSelector} from 'src/store/selectors';
import {useSelector} from 'react-redux';
import {
  getTask,
  updateTaskStatus
} from 'src/store/reducer/thunks/todolistActions';
import {set} from 'date-fns';

export default function Todolist({navigation}) {
  const dispatch = useAppDispatch();
  const {user} = useSelector(userSelector);
  // const [task, setTask] = useState([]);
  const {tasks, isLoading} = useSelector(todolistSelector);

  const [isAddTaskModalVisible, setAddTaskModalVisible] = useState(false);

  useEffect(() => {
    if (user) {
      dispatch(
        getTask({
          userId: user.uid
        })
      );
    }
  }, []);

  useEffect(() => {
    console.log('task', tasks);
  }, [tasks]);

  const handleAddTask = newTaskTitle => {
    // setTask(prevTasks => [
    //   ...prevTasks,
    //   {
    //     id: (prevTasks.length + 1).toString(),
    //     title: newTaskTitle.title,
    //     description: newTaskTitle.description,
    //     notificationTime: newTaskTitle.notificationTime,
    //     isComplete: false
    //   }
    // ]);
    setAddTaskModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={{alignItems: 'center', paddingTop: 14}}>
        <Text
          style={{
            textTransform: 'uppercase',
            color: 'black',
            fontSize: 24,
            fontWeight: 'bold'
          }}>
          All tasks
        </Text>
      </View>
      <View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 14
          }}>
          <Text style={styles.dayText}>Today</Text>
          <TouchableOpacity onPress={() => setAddTaskModalVisible(true)}>
            <AntDesign name="plus" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View>
          {tasks.map((item, index) => {
            return (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  padding: 14,
                  paddingLeft: 30
                }}>
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity
                    style={{paddingTop: 4}}
                    onPress={() => {
                      let newTask = [...tasks];
                      newTask[index].isComplete = !newTask[index].isComplete;
                      dispatch(
                        updateTaskStatus({
                          taskId: item.id,
                          data: {
                            isComplete: !item.isComplete
                          }
                        })
                      );
                    }}>
                    <AntDesign
                      name={item.isComplete ? 'checkcircle' : 'checkcircleo'}
                      size={18}
                      color={item.isComplete ? 'gray' : 'black'}
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: 'bold',
                      color: item.isComplete ? 'gray' : 'black',
                      paddingLeft: 10,
                      textDecorationLine: item.isComplete
                        ? 'line-through'
                        : 'none',
                      maxWidth: 200 // Set your desired maximum width here
                    }}
                    numberOfLines={1} // Limit to one line
                    ellipsizeMode="tail" // Show ellipsis (...) at the end if the text overflows
                  >
                    {item.title}
                  </Text>
                </View>
                <TouchableOpacity style={{paddingTop: 4}}>
                  {item.isComplete ? (
                    <AntDesign name="closecircle" size={18} color="gray" />
                  ) : null}
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </View>
      <AddTask
        isVisible={isAddTaskModalVisible}
        onClose={() => setAddTaskModalVisible(false)}
        onAddTask={handleAddTask}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  dayText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold'
    // padding: 8
  }
});
