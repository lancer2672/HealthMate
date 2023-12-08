import {createAsyncThunk} from '@reduxjs/toolkit';
import {addnewFoodMeal} from 'src/services/firebase/firestore/foodMeal';

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

// Các thunks khác nếu cần
// ...
