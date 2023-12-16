import {createSlice} from '@reduxjs/toolkit';
import {addFoodMeal, getFoodMealByDate} from './thunks/foodMealActions'; // Thay đường dẫn thật

const initialState = {
  foodMeals: [
    {
      mealName: 'breakfast',
      food: []
    },
    {
      mealName: 'lunch',
      food: []
    },
    {
      mealName: 'dinner',
      food: []
    },
    {
      mealName: 'snacks',
      food: []
    }
  ],
  totalCalories: 0,
  isLoading: false,
  error: null
};

const actions = [addFoodMeal, getFoodMealByDate]; // Thêm các thunks khác nếu cần

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
      })
      .addCase(getFoodMealByDate.pending, state => {
        state.isLoading = true;
      })
      .addCase(getFoodMealByDate.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
        console.log('Get food meal error:', action.error);
      })
      .addCase(getFoodMealByDate.fulfilled, (state, {payload}) => {
        state.isLoading = false;
        state.totalCalories = 0;
        state.foodMeals.forEach(meal => {
          meal.food = [];
        });
        console.log('payload', payload);
        payload.map(item => {
          switch (item.mealName) {
            case 'breakfast':
              {
                state.foodMeals[0].food.push({
                  ...item.food,
                  id: item.id,
                  date: item.date
                });
                state.totalCalories += item.food.realCalories;
              }
              break;
            case 'lunch':
              {
                state.foodMeals[1].food.push({
                  ...item.food,
                  id: item.id,
                  date: item.date
                });
                state.totalCalories += item.food.realCalories;
              }
              break;
            case 'dinner':
              {
                state.foodMeals[2].food.push({
                  ...item.food,
                  id: item.id,
                  date: item.date
                });
                state.totalCalories += item.food.realCalories;
              }
              break;
            case 'snacks':
              {
                state.foodMeals[3].food.push({
                  ...item.food,
                  id: item.id,
                  date: item.date
                });
                state.totalCalories += item.food.realCalories;
              }
              break;
          }
        }); // Cập nhật danh sách bữa ăn
      });
    // Xử lý các trạng thái thành công và thất bại của các thunks khác nếu cần
    // ...
  }
});

export default foodMealSlice;
