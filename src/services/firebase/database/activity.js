import {getSpecificDateTimeStamp} from 'src/utils/dateTimeHelper';
import firebaseDatabase from './index';

const DB_NAME = 'activity';
export const activityField = {
  STEPS: 'steps',
  DISTANCE: 'distance',
  CALORIES: 'calories'
};
export async function updateUserActivity({userId, field, value}) {
  try {
    const currentTimeStamp = getSpecificDateTimeStamp();
    const userActivityRef = firebaseDatabase.ref(
      `${userId}/${DB_NAME}/${currentTimeStamp}`
    );
    const snapshot = await userActivityRef.once('value');
    const data = snapshot.val();

    console.log('updateUserActivity data', {
      data,
      userId,
      field,
      value
    });
    await userActivityRef.update({[field]: value});
  } catch (er) {
    console.log('update steps error', er);
  }
}

export async function updateUserActivityRecord({userId, activity}) {
  try {
    const currentTimeStamp = getSpecificDateTimeStamp();
    const userActivityRef = firebaseDatabase.ref(
      `${userId}/${DB_NAME}/${currentTimeStamp}`
    );
    const snapshot = await userActivityRef.once('value');
    const data = snapshot.val();
    await userActivityRef.update({...data, ...activity});
  } catch (er) {
    console.log('error', er);
  }
}

export async function getUserActivityField({userId, timestampKey, field}) {
  try {
    const userActivityRef = firebaseDatabase.ref(
      `${userId}/${DB_NAME}/${timestampKey}`
    );
    const snapshot = await userActivityRef.once('value');
    const data = snapshot.val();
    console.log('getUserActivityField', data[field]);
    return data[field];
  } catch (er) {
    console.log('update steps error', er);
  }
}

export async function getStepsByMonth({userId, date}) {
  try {
    const startOfMonth = new Date(
      date.getUTCFullYear(),
      date.getMonth(),
      1
    ).getTime();
    const endOfMonth = new Date(
      date.getUTCFullYear(),
      date.getMonth() + 1,
      0
    ).getTime();
    const userActivityRef = firebaseDatabase.ref(`${userId}/${DB_NAME}`);

    const query = await userActivityRef
      .orderByKey()
      .startAt(startOfMonth.toString())
      .endAt(endOfMonth.toString());

    let data = [];
    await query.once('value', function (snapshot) {
      snapshot.forEach(function (childSnapshot) {
        var childKey = childSnapshot.key;
        var childData = childSnapshot.val();
        const step = {[childKey]: childData.steps};
        data.push(step);
      });
    });
    console.log('getStepsByMonth', {date, data});
    return data;
  } catch (error) {
    console.log('Error getting steps by month', error);
    return [];
  }
}

export async function getTodayStepsGoal({userId}) {
  try {
    const currentTimeStamp = getSpecificDateTimeStamp();
    const userActivityRef = firebaseDatabase.ref(
      `${userId}/${DB_NAME}/${currentTimeStamp}`
    );
    let data = (await userActivityRef.once('value')).val();
    return data?.stepTarget || 0;
  } catch (error) {
    console.log('Error getting step goal', error);
    return 0;
  }
}
