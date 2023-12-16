import firestore from '@react-native-firebase/firestore';
import {is} from 'date-fns/locale';

const todolistRef = firestore().collection('todolist');

export async function addNewTask({
  userId,
  title,
  description,
  createdAt,
  notificationTime
}) {
  const newTask = {userId, title, description, createdAt, notificationTime};
  await todolistRef.add(newTask);
}

export async function getTaskByUser(userId) {
  const task = await todolistRef.where('userId', '==', userId).get();
  // console.log('task', task.docs);
  return task.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

export async function updateTask(taskId, data) {
  await todolistRef.doc(taskId).update({
    isComplete: data.isComplete
  });
}

export async function deleteTask(taskId) {
  await todolistRef.doc(taskId).delete();
}
