import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import {DEFAULT_WATER_AMOUNT} from '../../../constants';
import {transformDrinkProgressData} from '../../../utils/tranformData';
const drinkHistoryRef = firestore().collection('drinkProgress');

export async function addNewDrinkProgress({userId, date, goal}) {
  const newDrinkProgress = {userId, date, goal, sessions: []};
  const drinkProgressRef = await drinkHistoryRef.add(newDrinkProgress);
  return {id: drinkProgressRef.id, ...newDrinkProgress};
}

export async function addNewSession({drinkProgressId, amount}) {
  const drinkProgressRef = drinkHistoryRef.doc(drinkProgressId);
  const drinkProgressDoc = await drinkProgressRef.get();
  if (drinkProgressDoc.exists) {
    const drinkProgressData = drinkProgressDoc.data();
    drinkProgressData.sessions.push({time: new Date(), amount});
    await drinkProgressRef.update(drinkProgressData);

    const newData = {...drinkProgressData, id: drinkProgressDoc.id};
    const newProgress = transformDrinkProgressData(newData);

    return newProgress;
  } else {
    throw new Error('Drink Progress does not exist');
  }
}

export async function getDrinkProgressByDate({userId, date}) {
  try {
    console.log('{userId, date}', {userId, date});
    const userDrinkProgressRef = drinkHistoryRef
      .where('userId', '==', userId)
      .where('date', '==', date);
    const userDrinkProgressSnapshot = await userDrinkProgressRef.get();
    if (!userDrinkProgressSnapshot.empty) {
      const data = {
        ...userDrinkProgressSnapshot.docs[0].data(),
        id: userDrinkProgressSnapshot.docs[0].id
      };
      const progress = transformDrinkProgressData(data);
      return progress;
    } else {
      const newDrinkProgress = {userId, date, goal: 0, sessions: []};
      const defaultGoal = await AsyncStorage.getItem(DEFAULT_WATER_AMOUNT);
      if (defaultGoal != null) {
        newDrinkProgress.goal = JSON.parse(defaultGoal);
      }
      const drinkProgressRef = await drinkHistoryRef.add(newDrinkProgress);
      return {id: drinkProgressRef.id, ...newDrinkProgress};
    }
  } catch (er) {
    console.log('get drink progress by date error: ', er);
    throw new Error('er', er);
  }
}
export async function getDrinkProgressByMonth({userId, year, month}) {
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);
  console.log({userId, year, month});
  const userDrinkProgressRef = drinkHistoryRef
    .where('userId', '==', userId)
    .where('date', '>=', startDate)
    .where('date', '<=', endDate);

  const userDrinkProgressSnapshot = await userDrinkProgressRef.get();

  if (userDrinkProgressSnapshot.empty) {
    return [];
  }

  const dinkProgressList = userDrinkProgressSnapshot.docs.map(doc => {
    const data = {
      ...doc.data(),
      id: doc.id
    };
    const progress = transformDrinkProgressData(data);
    return progress;
  });

  return dinkProgressList;
}

export async function setGoal({drinkProgressId, goal}) {
  const drinkProgressRef = drinkHistoryRef.doc(drinkProgressId);
  const drinkProgressDoc = await drinkProgressRef.get();
  if (drinkProgressDoc.exists) {
    const drinkProgressData = drinkProgressDoc.data();
    drinkProgressData.goal = goal;
    drinkProgressData.sessions = [];
    await drinkProgressRef.update(drinkProgressData);

    const newData = {...drinkProgressData, id: drinkProgressDoc.id};
    const newProgress = transformDrinkProgressData(newData);
    return newProgress;
  } else {
    throw new Error('Drink Progress does not exist');
  }
}
