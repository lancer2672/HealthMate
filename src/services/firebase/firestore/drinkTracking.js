import firestore from '@react-native-firebase/firestore';
const drinkHistoryRef = firestore().collection('drinkHistory');

export async function addNewHistory({userId, date, goal}) {
  const newHistory = {userId, date, goal, sessions: []};
  const historyDocRef = await drinkHistoryRef.add(newHistory);
  return {id: historyDocRef.id, ...newHistory};
}

export async function addNewSession({historyId, amount}) {
  const historyRef = drinkHistoryRef.doc(historyId);
  const historyDoc = await historyRef.get();
  if (historyDoc.exists) {
    const historyData = historyDoc.data();
    historyData.sessions.push({time: new Date(), amount});
    await historyRef.update(historyData);
    return {...historyData, id: historyDoc.id};
  } else {
    throw new Error('History does not exist');
  }
}

export async function getHistoryByDate({userId, date}) {
  const userHistoriesRef = drinkHistoryRef
    .where('userId', '==', userId)
    .where('date', '==', date);
  const userHistoriesSnapshot = await userHistoriesRef.get();
  if (!userHistoriesSnapshot.empty) {
    return {
      ...userHistoriesSnapshot.docs[0].data(),
      id: userHistoriesSnapshot.docs[0].id,
    };
  } else {
    const newHistory = {userId, date, goal: 0, sessions: []};
    const historyDocRef = await drinkHistoryRef.add(newHistory);
    return {id: historyDocRef.id, ...newHistory};
  }
}

export async function setGoal({historyId, goal}) {
  const historyRef = drinkHistoryRef.doc(historyId);
  const historyDoc = await historyRef.get();
  if (historyDoc.exists) {
    const historyData = historyDoc.data();
    historyData.goal = goal;
    historyData.sessions = [];
    await historyRef.update(historyData);
    return historyData;
  } else {
    throw new Error('History does not exist');
  }
}
