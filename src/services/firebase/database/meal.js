import {getSpecificDateTimeStamp} from 'src/utils/dateTimeHelper';
import firebaseDatabase from './index';

const DB_NAME = 'meal';
export async function saveMeal({userId, planName, meal}) {
  try {
    const currentTimeStamp = getSpecificDateTimeStamp();
    const userMealRef = firebaseDatabase.ref(`${userId}/${DB_NAME}`);
    await userMealRef.update({[planName]: meal});
  } catch (er) {
    console.log('setTodayMeal error', er);
  }
}

export async function getMealByDate({userId, date}) {
  try {
    const timestamp = getSpecificDateTimeStamp(date);
    const userMealRef = firebaseDatabase.ref(
      `${userId}/${DB_NAME}/${timestamp}`
    );
    const snapshot = await userMealRef.once('value');
    const meal = snapshot.val();
    return meal;
  } catch (er) {
    console.log('getMealByDate error', er);
  }
}
export function observeTodayMeal(userId, callback) {
  const currentTimeStamp = getSpecificDateTimeStamp();
  const userMealRef = firebaseDatabase.ref(`${userId}/${DB_NAME}`);
  userMealRef.on('value', snapshot => {
    const meal = snapshot.val();
    callback(meal);
    console.log('observeTodayMeal  meals', meal);
  });
}
