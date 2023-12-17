import firestore from '@react-native-firebase/firestore';
import {getSpecificDateTimeStamp} from 'src/utils/dateTimeHelper';
const usersRef = firestore().collection('user');

export async function getUserPlan(userId) {
  try {
    const user = await usersRef.doc(userId).get();
    return user.data().plans.filter(plan => !plan.deletedAt);
  } catch (error) {
    console.error('Get user plan error', error.message);
    throw error;
  }
}

export async function addPlan({userId, plan}) {
  try {
    const planWithId = {...plan, id: new Date().getTime().toString()};
    await usersRef.doc(userId).update({
      plans: firestore.FieldValue.arrayUnion(planWithId)
    });
    return getUserPlan(userId);
  } catch (error) {
    console.error('Add plan error', error.message);
    throw error;
  }
}

export async function removePlan({userId, planName}) {
  try {
    const user = await usersRef.doc(userId).get();
    const updatedPlans = user
      .data()
      .plans.map(plan =>
        plan.planName === planName ? {...plan, deletedAt: new Date()} : plan
      );
    await usersRef.doc(userId).update({plans: updatedPlans});
    return updatedPlans.filter(plan => !plan.deletedAt);
  } catch (error) {
    console.error('Remove plan error', error.message);
    throw error;
  }
}

export async function addExercise({userId, planId, exercise}) {
  try {
    const user = await usersRef.doc(userId).get();
    const updatedPlans = user.data().plans.map(plan => {
      if (plan.id === planId) {
        const exerciseIndex = plan.exercise.findIndex(
          ex => ex.id === exercise.id
        );
        if (exerciseIndex > -1) {
          plan.exercise[exerciseIndex] = exercise;
        } else {
          plan.exercise.push(exercise);
        }
      }
      return plan;
    });
    await usersRef.doc(userId).update({plans: updatedPlans});
    return updatedPlans.filter(plan => !plan.deletedAt);
  } catch (error) {
    console.error('Add exercise error', error.message);
    throw error;
  }
}

export async function removeExercise({userId, planId, exerciseName}) {
  try {
    const user = await usersRef.doc(userId).get();
    const updatedPlans = user.data().plans.map(plan => {
      if (plan.id === planId) {
        plan.exercise = plan.exercise.filter(ex => ex.name !== exerciseName);
      }
      return plan;
    });
    await usersRef.doc(userId).update({plans: updatedPlans});
    return updatedPlans.find(plan => plan.id === planId);
  } catch (error) {
    console.error('Remove exercise error', error.message);
    throw error;
  }
}

export async function updatePlanExercise({userId, id, exercise}) {
  try {
    console.log('ex1', id, exercise);
    const user = await usersRef.doc(userId).get();
    const plans = user.data().plans;
    const updatedPlans = plans.map(plan => {
      if (plan.id === id) {
        plan.exercise = exercise;
      }
      return plan;
    });

    await usersRef.doc(userId).update({
      plans: updatedPlans
    });

    const updatedPlan = updatedPlans.find(plan => plan.id === id);
    return updatedPlan;
  } catch (error) {
    console.log('Update exercise error', error.message);
    throw error;
  }
}
export async function updateWorkoutPlan({userId, planId, id}) {
  try {
    const user = await usersRef.doc(userId).get();
    const workoutPlan = user.data().workoutPlan;

    workoutPlan[id] = planId;

    await usersRef.doc(userId).update({
      workoutPlan: workoutPlan
    });
    console.log('workoutPlan', workoutPlan);
    return workoutPlan;
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
