import {createSlice} from '@reduxjs/toolkit';
import {addFoodMeal} from './thunks/foodMealActions'; // Thay đường dẫn thật

const initialState = {
  foodMeals: [],
  isLoading: false,
  error: null
};

const actions = [addFoodMeal]; // Thêm các thunks khác nếu cần

const foodMealSlice = createSlice({
  name: 'foodMeals',
  initialState: initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(addFoodMeal.pending, state => {
        state.isLoading = true;
      })
      .addCase(addFoodMeal.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
        console.log('Add food meal error:', action.error);
      })
      .addCase(addFoodMeal.fulfilled, (state, {payload}) => {
        state.isLoading = false;
        state.foodMeals.push(payload); // Cập nhật danh sách bữa ăn
      });
    // Xử lý các trạng thái thành công và thất bại của các thunks khác nếu cần
    // ...
  }
});

export default foodMealSlice;
