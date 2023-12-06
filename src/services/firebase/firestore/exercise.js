import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getCurrentDateTimeStamp} from 'src/utils/dateTimeHelper';
const usersRef = firestore().collection('user');

const returnPlans = async userId => {
  const user = await usersRef.doc(userId).get();
  return user.data().plans;
};
export async function getUserPlan(userId) {
  try {
    const user = await usersRef.doc(userId).get();
    const plans = user.data().plans;
    const activePlans = plans.filter(plan => !plan.deletedAt);
    return activePlans;
  } catch (error) {
    console.log('Get user plan error', error.message);
    throw error;
  }
}

export async function addPlan({userId, plan}) {
  try {
    const planId = new Date().getTime().toString();
    const planWithId = {...plan, id: planId};
    await usersRef.doc(userId).update({
      plans: firestore.FieldValue.arrayUnion(planWithId)
    });

    return returnPlans(userId);
  } catch (error) {
    console.log('Add plan error', error.message);
    throw error;
  }
}

export async function removePlan({userId, planName}) {
  try {
    const user = await usersRef.doc(userId).get();
    const plans = user.data().plans;
    const updatedPlans = plans.map(plan => {
      if (plan.planName === planName) {
        return {...plan, deletedAt: new Date()};
      }
      return plan;
    });
    await usersRef.doc(userId).update({
      plans: updatedPlans
    });
    return updatedPlans;
  } catch (error) {
    console.log('Remove plan error', error.message);
    throw error;
  }
}

export async function addExercise({userId, planName, exercise}) {
  try {
    const user = await usersRef.doc(userId).get();
    const plans = user.data().plans;
    const updatedPlans = plans.map(plan => {
      if (plan.planName === planName) {
        plan.exercise.push(exercise);
      }
      return plan;
    });

    await usersRef.doc(userId).update({
      plans: updatedPlans
    });
    const updatedPlan = updatedPlans.find(plan => plan.planName === planName);
    return updatedPlan;
  } catch (error) {
    console.log('Add exercise error', error.message);
    throw error;
  }
}

export async function removeExercise({userId, planName, exerciseName}) {
  try {
    const user = await usersRef.doc(userId).get();
    const plans = user.data().plans;
    const updatedPlans = plans.map(plan => {
      if (plan.planName === planName) {
        plan.exercise = plan.exercise.filter(ex => ex.name !== exerciseName);
      }
      return plan;
    });

    await usersRef.doc(userId).update({
      plans: updatedPlans
    });
    const updatedPlan = updatedPlans.find(plan => plan.planName === planName);
    return updatedPlan;
  } catch (error) {
    console.log('Remove exercise error', error.message);
    throw error;
  }
}

export async function updateExercise({userId, id, newExerciseList}) {
  try {
    const user = await usersRef.doc(userId).get();
    const plans = user.data().plans;
    const updatedPlans = plans.map(plan => {
      if (plan.id === id) {
        plan.exercise = newExerciseList;
      }
      return plan;
    });

    await usersRef.doc(userId).update({
      plans: updatedPlans
    });

    const updatedPlan = updatedPlans.find(plan => plan.planName === planName);
    return updatedPlan;
  } catch (error) {
    console.log('Update exercise error', error.message);
    throw error;
  }
}
export async function updateWorkoutPlan({userId, planId, id}) {
  try {
    const user = await usersRef.doc(userId).get();
    const weeklyPlans = user.data().weeklyPlans;

    const existingPlan = weeklyPlans[id];

    if (existingPlan) {
      const updatedPlan = {...existingPlan, planId};
      weeklyPlans[id] = updatedPlan;

      await usersRef.doc(userId).update({
        workoutPlan: weeklyPlans
      });

      return updatedPlan;
    } else {
      weeklyPlans[id] = planId;

      await usersRef.doc(userId).update({
        workoutPlan: weeklyPlans
      });

      return newPlan;
    }
  } catch (error) {
    console.log('Add plan to weekly plans error', error.message);
    throw error;
  }
}

export async function updateDailyWorkoutPlan({userId, planId}) {
  try {
    const user = await usersRef.doc(userId).get();
    const weeklyPlans = user.data().weeklyPlans;

    // Set tất cả id từ 0 -> 6
    for (let id = 0; id <= 6; id++) {
      weeklyPlans[id] = planId;
    }

    await usersRef.doc(userId).update({
      workoutPlan: weeklyPlans
    });

    return weeklyPlans;
  } catch (error) {
    console.log('Update daily workout plans error', error.message);
    throw error;
  }
}

export async function saveHistoryExercise({userId, doExercise}) {
  try {
    const dateKey = getCurrentDateTimeStamp();
    const exerciseHistory = {[dateKey]: doExercise};

    await usersRef.doc(userId).set(
      {
        exerciseHistory: firestore.FieldValue.arrayUnion(exerciseHistory)
      },
      {merge: true}
    );
  } catch (error) {
    console.log('Save history exercise error', error.message);
    throw error;
  }
}
