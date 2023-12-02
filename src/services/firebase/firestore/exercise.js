import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
const usersRef = firestore().collection('user');

const returnPlans = async userId => {
  const user = await usersRef.doc(userId).get();
  return user.data().plans;
};

export async function getUserPlan(userId) {
  try {
    const user = await usersRef.doc(userId).get();
    return user.data().plans;
  } catch (error) {
    console.log('Get user plan error', error.message);
    throw error;
  }
}

export async function addPlan({userId, plan}) {
  try {
    await usersRef.doc(userId).update({
      plans: firestore.FieldValue.arrayUnion(plan)
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
    const updatedPlans = plans.filter(plan => plan.planName !== planName);

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

export async function updateExercise({
  userId,
  planName,
  oldExerciseName,
  newExercise
}) {
  try {
    const user = await usersRef.doc(userId).get();
    const plans = user.data().plans;
    const updatedPlans = plans.map(plan => {
      if (plan.planName === planName) {
        plan.exercise = plan.exercise.map(ex =>
          ex.name === oldExerciseName ? newExercise : ex
        );
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
