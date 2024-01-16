import {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useSelector} from 'react-redux';
import {useAppDispatch} from 'src/store/hooks';
import {
  getTask,
  updateTaskStatus
} from 'src/store/reducer/thunks/todolistActions';
import {todolistSelector, userSelector} from 'src/store/selectors';
import AddTask from '../components/AddTaskModal.component';

export default function Todolist({navigation}) {
  const dispatch = useAppDispatch();
  const {user} = useSelector(userSelector);
  // const [task, setTask] = useState([]);
  const {tasks, isLoading} = useSelector(todolistSelector);

  const [isAddTaskModalVisible, setAddTaskModalVisible] = useState(false);

  useEffect(() => {
    console.log('user34', user);
    if (user) {
      dispatch(
        getTask({
          userId: user.uid
        })
      );
    }
  }, []);

  // useEffect(() => {
  //   console.log('task', tasks[0].notificationTime);
  // }, [tasks]);

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

  const formatTimestamp = timestamp => {
    const milliseconds =
      timestamp.seconds * 1000 + Math.round(timestamp.nanoseconds / 1e6);

    const date = new Date(milliseconds);

    const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][
      date.getDay()
    ];

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    // const formattedTime = `${dayOfWeek}, ${hours}:${minutes}`;
    const formattedTime = `${hours}:${minutes}`;

    return formattedTime;
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
                  <View
                    style={{
                      borderRadius: 15,
                      borderWidth: 1,
                      borderColor: 'gray',
                      marginLeft: 10,
                      padding: 4
                    }}>
                    <Text
                      style={{
                        fontSize: 12,
                        color: 'gray',
                        textDecorationLine: item.isComplete
                          ? 'line-through'
                          : 'none'
                      }}>
                      {formatTimestamp(item.notificationTime)}
                    </Text>
                  </View>
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
