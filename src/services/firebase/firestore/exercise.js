import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getSpecificDateTimeStamp} from 'src/utils/dateTimeHelper';
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
        const exerciseIndex = plan.exercises.findIndex(
          ex => ex.id === exercise.id
        );
        if (exerciseIndex > -1) {
          plan.exercises[exerciseIndex] = exercise; // replace the existing exercise
        } else {
          plan.exercises.push(exercise); // add the new exercise
        }
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

export async function updatePlanExercise({userId, id, exericse}) {
  try {
    const user = await usersRef.doc(userId).get();
    const plans = user.data().plans;
    const updatedPlans = plans.map(plan => {
      if (plan.id === id) {
        plan.exercise = plan.exercise.map(e => {
          if (e.id === exericse.id) {
            return exericse;
          }
          return e;
        });
      }
      return plan;
    });

    await usersRef.doc(userId).update({
      plans: updatedPlans
    });

    const updatedPlan = updatedPlans.find(plan => plan.id === planId);
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
export async function saveHistoryExercise({userId, planId, doExercise}) {
  try {
    const dateKey = getSpecificDateTimeStamp();

    const newExerciseHistory = {
      [dateKey]: {
        finishPlanId: planId,
        detailExercise: doExercise
      }
    };

    const userDoc = await usersRef.doc(userId).get();
    const userData = userDoc.data();

    if (userData.exerciseHistory) {
      userData.exerciseHistory = {
        ...userData.exerciseHistory,
        ...newExerciseHistory
      };
    } else {
      userData.exerciseHistory = newExerciseHistory;
    }
    console.log('saveHistoryExercise', newExerciseHistory);
    await usersRef.doc(userId).set(userData, {merge: true});
  } catch (error) {
    console.log('Save history exercise error', error.message);
    throw error;
  }
}

export async function getHistoryByDate({userId, dateKey}) {
  try {
    const userDoc = await usersRef.doc(userId).get();
    const userData = userDoc.data();

    const exerciseHistory = userData.exerciseHistory[dateKey];

    return exerciseHistory;
  } catch (error) {
    console.log('Get history by date error', error.message);
    throw error;
  }
}
