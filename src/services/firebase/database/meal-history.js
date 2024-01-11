import {getSpecificDateTimeStamp} from 'src/utils/dateTimeHelper';
import firebaseDatabase from './index';

const HISTORY_DB_NAME = 'historymeals';
export async function setHistoryMeal({userId, meal, mealType}) {
  try {
    const currentTimeStamp = getSpecificDateTimeStamp();
    const userMealRef = firebaseDatabase.ref(
      `${userId}/${HISTORY_DB_NAME}/${currentTimeStamp}/${mealType}`
    );
    await userMealRef.set(meal);
  } catch (er) {
    console.log('setHistoryMeal error', er);
  }
}

export async function addFoodToHistory({userId, mealType, food}) {
  try {
    console.log('addFoodToHistory', food);

    const currentTimeStamp = getSpecificDateTimeStamp();
    const userMealRef = firebaseDatabase.ref(
      `${userId}/${HISTORY_DB_NAME}/${currentTimeStamp}/${mealType}`
    );
    const snapshot = await userMealRef.once('value');
    const meal = snapshot.val() || [];
    meal.push(food);
    await userMealRef.set(meal);
  } catch (er) {
    console.log('addFoodToHistory error', er);
  }
}

export async function updateFoodHistory({userId, mealType, food}) {
  try {
    const currentTimeStamp = getSpecificDateTimeStamp();
    const userMealRef = firebaseDatabase.ref(
      `${userId}/${HISTORY_DB_NAME}/${currentTimeStamp}/${mealType}`
    );
    const snapshot = await userMealRef.once('value');
    const meal = snapshot.val() || [];
    const updatedMeal = meal.map(item =>
      item.tag_id === food.tag_id ? food : item
    );
    await userMealRef.set(updatedMeal);
  } catch (er) {
    console.log('updateFoodHistory error', er);
  }
}

export async function removeFoodFromHistory({userId, mealType, food}) {
  try {
    const currentTimeStamp = getSpecificDateTimeStamp();
    const userMealRef = firebaseDatabase.ref(
      `${userId}/${HISTORY_DB_NAME}/${currentTimeStamp}/${mealType}`
    );
    const snapshot = await userMealRef.once('value');
    const meal = snapshot.val() || [];
    const updatedMeal = meal.filter(item => item.tag_id !== food.tag_id);
    await userMealRef.set(updatedMeal);
  } catch (er) {
    console.log('removeFoodFromHistory error', er);
  }
}

export async function getHistoryMealByDate({userId, date}) {
  try {
    const timestamp = getSpecificDateTimeStamp(date);
    const userMealRef = firebaseDatabase.ref(
      `${userId}/${HISTORY_DB_NAME}/${timestamp}`
    );
    const snapshot = await userMealRef.once('value');
    const meal = snapshot.val();
    return meal;
  } catch (er) {
    console.log('getHistoryMealByDate error', er);
  }
}

export function observeHistoryMealsToday(userId, callback) {
  const currentTimeStamp = getSpecificDateTimeStamp();
  const userMealRef = firebaseDatabase.ref(
    `${userId}/${HISTORY_DB_NAME}/${currentTimeStamp}`
  );
  userMealRef.on('value', snapshot => {
    const meal = snapshot.val();
    callback(meal);
  });
}
