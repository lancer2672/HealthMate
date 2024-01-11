import firebaseDatabase from './index';
const CUSTOM_FOOD_DB_NAME = 'customFood';

export async function addCustomFood({userId, food}) {
  try {
    const userFoodRef = firebaseDatabase.ref(
      `${userId}/${CUSTOM_FOOD_DB_NAME}`
    );
    const snapshot = await userFoodRef.once('value');
    const customFood = snapshot.val() || [];
    customFood.push(food);
    await userFoodRef.set(customFood);
  } catch (er) {
    console.log('addCustomFood error', er);
  }
}

export async function removeCustomFood({userId, food}) {
  try {
    const userFoodRef = firebaseDatabase.ref(
      `${userId}/${CUSTOM_FOOD_DB_NAME}`
    );
    const snapshot = await userFoodRef.once('value');
    const customFood = snapshot.val() || [];
    const updatedFood = customFood.map(item =>
      item.tag_id === food.tag_id ? {...item, deletedAt: Date.now()} : item
    );
    await userFoodRef.set(updatedFood);
  } catch (er) {
    console.log('removeCustomFood error', er);
  }
}

export function observeCustomFood(userId, callback) {
  const userFoodRef = firebaseDatabase.ref(`${userId}/${CUSTOM_FOOD_DB_NAME}`);
  userFoodRef.on('value', snapshot => {
    const customFood = snapshot.val() || [];
    const activeFood = customFood.filter(item => item.deletedAt == null);

    callback(activeFood);
  });
}

export async function updateCustomFood({userId, food}) {
  try {
    const userFoodRef = firebaseDatabase.ref(
      `${userId}/${CUSTOM_FOOD_DB_NAME}`
    );
    const snapshot = await userFoodRef.once('value');
    const customFood = snapshot.val() || [];
    const updatedFood = customFood.map(item =>
      item.tag_id === food.tag_id ? food : item
    );
    await userFoodRef.set(updatedFood);
  } catch (er) {
    console.log('updateCustomFood error', er);
  }
}
