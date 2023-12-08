import firestore from '@react-native-firebase/firestore';

const foodMealRef = firestore().collection('foodMeals');

export async function addnewFoodMeal({userId, mealName, date, food}) {
  const newFoodMeal = {userId, mealName, date, food};
  await foodMealRef.add(newFoodMeal);
}
