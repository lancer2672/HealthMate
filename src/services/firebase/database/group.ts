import firebaseDatabase from './index';
import firestore from '@react-native-firebase/firestore';

const usersRef = firestore().collection('user');

const groupRef = firebaseDatabase.ref('groups');

export async function joinGroup({userId, groupId}) {
  try {
    const userFirestoreRef = usersRef.doc(userId);
    await userFirestoreRef.update({groupId});

    const groupRealtimeRef = groupRef.child(groupId);
    await groupRealtimeRef
      .child('members')
      .child(userId)
      .set({totalPoint: 0, weekPoint: 0});
  } catch (er) {
    console.log('join group error', er);
  }
}

export async function quitGroup({groupId, userId, nextCreatorId = null}) {
  try {
    console.log('userid,quitGroup', userId, groupId);

    const userFirestoreRef = usersRef.doc(userId);
    await userFirestoreRef.update({groupId: null});

    const groupRealtimeRef = groupRef.child(groupId);
    await groupRealtimeRef.child('members').child(userId).remove();

    const groupSnapshot = await groupRealtimeRef.once('value');
    if (groupSnapshot.exists()) {
      const groupData = groupSnapshot.val();
      if (groupData.creatorId === userId) {
        if (nextCreatorId) {
          await groupRealtimeRef.update({creatorId: nextCreatorId});
        } else {
          // Nếu không có nextCreatorId, xóa nhóm
          //   await groupRealtimeRef.remove();
        }
      }
    } else {
      console.log('Group does not exist');
    }
  } catch (er) {
    console.log('er', er);
  }
}

export async function setMinExerciseTime({groupId, minExerciseTime}) {
  const groupRef = firebaseDatabase.ref('groups/' + groupId);
  await groupRef.update({minExerciseTime});
}
export async function setGroupPlan({groupId, plan}) {
  const groupRef = firebaseDatabase.ref('groups/' + groupId);
  await groupRef.update({plan});
}

export async function createGroup({creatorId, name}) {
  const groupRef = await firebaseDatabase.ref('groups').push();
  const newGroup = {
    creatorId,
    name,
    plan: [],
    createdAt: Date.now(),
    minExerciseTime: 0,
    members: {},
    groupSearchId: groupRef.key.slice(-6)
  };
  await groupRef.set(newGroup);
  return {id: groupRef.key, ...newGroup};
}

export async function addPoint({groupId, userId, point}) {
  const groupRealtimeRef = groupRef.child(groupId);
  const memberRef = groupRealtimeRef.child('members').child(userId);

  const memberSnapshot = await memberRef.once('value');
  if (memberSnapshot.exists()) {
    const memberData = memberSnapshot.val();
    await memberRef.update({
      totalPoint: memberData.totalPoint + point,
      weekPoint: memberData.weekPoint + point
    });
  } else {
    throw new Error('Member does not exist in the group');
  }
}

export async function getGroupPlan({groupId}) {
  const groupRef = firebaseDatabase.ref('groups/' + groupId);
  let groupPlan;

  await groupRef.once('value', snapshot => {
    if (snapshot.exists()) {
      const groupData = snapshot.val();
      groupPlan = groupData.plan;
    } else {
      throw new Error('Group does not exist');
    }
  });

  return groupPlan;
}
