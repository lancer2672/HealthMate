import {createAsyncThunk} from '@reduxjs/toolkit';
import {
  addnewFoodMeal,
  getMealByDate
} from 'src/services/firebase/firestore/foodMeal';

export const addFoodMeal = createAsyncThunk(
  'foodMeals/addFoodMeal',
  async (data, thunkAPI) => {
    try {
      await addnewFoodMeal(data);
      return data;
    } catch (error) {
      console.error('Add food meal error:', error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getFoodMealByDate = createAsyncThunk(
  'foodMeals/getFoodMealByDate',
  async (data, thunkAPI) => {
    try {
      const foodMeals = await getMealByDate(
        data.userId,
        data.date,
        data.mealName
      );
      return foodMeals;
    } catch (error) {
      console.error('Get food meal error:', error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Các thunks khác nếu cần
// ...
