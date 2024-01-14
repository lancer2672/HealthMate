import {getSpecificDateTimeStamp} from 'src/utils/dateTimeHelper';
import firebaseDatabase from './index';

const HISTORY_DB_NAME = 'historycalorie';
export async function setHistoryCalorie({userId, record}) {
  try {
    const currentTimeStamp = getSpecificDateTimeStamp();
    const userRecordRef = firebaseDatabase.ref(
      `${userId}/${HISTORY_DB_NAME}/${currentTimeStamp}`
    );
    await userRecordRef.set(record);
  } catch (er) {
    console.log('setHistoryCalorie error', er);
  }
}

export async function addFoodToHistory({userId, food}) {
  try {
    console.log('addFoodToHistory', food);

    const currentTimeStamp = getSpecificDateTimeStamp();
    const userRecordRef = firebaseDatabase.ref(
      `${userId}/${HISTORY_DB_NAME}/${currentTimeStamp}`
    );
    const snapshot = await userRecordRef.once('value');
    const record = snapshot.val() || [];
    record.push(food);
    await userRecordRef.set(record);
  } catch (er) {
    console.log('addFoodToHistory error', er);
  }
}

export async function updateFoodHistory({userId, food}) {
  try {
    const currentTimeStamp = getSpecificDateTimeStamp();
    const userRecordRef = firebaseDatabase.ref(
      `${userId}/${HISTORY_DB_NAME}/${currentTimeStamp}`
    );
    const snapshot = await userRecordRef.once('value');
    const record = snapshot.val() || [];
    const updatedRecord = record.map(item =>
      item.tag_id === food.tag_id ? food : item
    );
    await userRecordRef.set(updatedRecord);
  } catch (er) {
    console.log('updateFoodHistory error', er);
  }
}

export async function removeFoodFromHistory({userId, food}) {
  try {
    const currentTimeStamp = getSpecificDateTimeStamp();
    const userRecordRef = firebaseDatabase.ref(
      `${userId}/${HISTORY_DB_NAME}/${currentTimeStamp}`
    );
    const snapshot = await userRecordRef.once('value');
    const record = snapshot.val() || [];
    const updatedRecord = record.filter(item => item.tag_id !== food.tag_id);
    await userRecordRef.set(updatedRecord);
  } catch (er) {
    console.log('removeFoodFromHistory error', er);
  }
}

export async function getHistoryCalorieByDate({userId, date}) {
  try {
    const timestamp = getSpecificDateTimeStamp(date);
    const userRecordRef = firebaseDatabase.ref(
      `${userId}/${HISTORY_DB_NAME}/${timestamp}`
    );
    const snapshot = await userRecordRef.once('value');
    const record = snapshot.val();
    return record;
  } catch (er) {
    console.log('getHistoryCalorieByDate error', er);
  }
}
export async function getHistoryCalorieByMonth({userId, year, month}) {
  try {
    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0);
    const startTimestamp = getSpecificDateTimeStamp(startOfMonth);
    const endTimestamp = getSpecificDateTimeStamp(endOfMonth);

    const userRecordRef = firebaseDatabase.ref(`${userId}/${HISTORY_DB_NAME}`);
    const snapshot = await userRecordRef
      .orderByKey()
      .startAt(startTimestamp.toString())
      .endAt(endTimestamp.toString())
      .once('value');

    const records = snapshot.val();
    console.log('getHistoryCalorieByMonth error', {year, month, records});
    return records;
  } catch (er) {
    console.log('getHistoryCalorieByMonth error', er);
  }
}

export async function getHistoryCalorieByWeek({userId, date}) {
  try {
    const startOfWeek = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() - date.getDay()
    );
    const endOfWeek = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + (6 - date.getDay())
    );
    const startTimestamp = getSpecificDateTimeStamp(startOfWeek);
    const endTimestamp = getSpecificDateTimeStamp(endOfWeek);

    const userRecordRef = firebaseDatabase.ref(`${userId}/${HISTORY_DB_NAME}`);
    const snapshot = await userRecordRef
      .orderByKey()
      .startAt(startTimestamp.toString())
      .endAt(endTimestamp.toString())
      .once('value');

    const records = snapshot.val();
    console.log('getHistoryCalorieByWeek', {startOfWeek, endOfWeek, records});
    return records;
  } catch (er) {
    console.log('getHistoryCalorieByWeek error', er);
  }
}
export function observeHistoryCaloriesToday(userId, callback) {
  const currentTimeStamp = getSpecificDateTimeStamp();
  const userRecordRef = firebaseDatabase.ref(
    `${userId}/${HISTORY_DB_NAME}/${currentTimeStamp}`
  );
  userRecordRef.on('value', snapshot => {
    const record = snapshot.val();
    callback(record);
  });
}
