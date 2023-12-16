import firestore from '@react-native-firebase/firestore';

const foodMealRef = firestore().collection('foodMeals');

export async function addnewFoodMeal({userId, mealName, date, food}) {
  const newFoodMeal = {userId, mealName, date, food};
  await foodMealRef.add(newFoodMeal);
}

export async function getMealByDate(userId, date, mealName) {
  const foodMeal = await foodMealRef
    .where('userId', '==', userId)
    .where('date', '==', date)
    .where('mealName', '==', mealName)
    .get();
  return foodMeal.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

export async function getTotalCalories(userId, date) {
  // console.log('userId', userId);
  // console.log('date', date);
  const foodMeal = await foodMealRef
    .where('userId', '==', userId)
    .where('date', '==', date)
    .get();

  // console.log('foodMeal', foodMeal.docs);

  let total = 0;

  foodMeal.docs.map(doc => {
    console.log('doc', doc);
    total += doc.data().food.realCalories;
  });
  return total;
}
