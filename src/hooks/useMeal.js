import {useCallback, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {observeHistoryMealsToday} from 'src/services/firebase/database/meal-history';
import {exerciseSelector, userSelector} from 'src/store/selectors';

function useMeal() {
  const {user} = useSelector(userSelector);
  const [foodIndex, setFoodIndex] = useState();
  const [todayMeal, setTodayMeal] = useState();
  const onHistoryMealChange = meal => {
    console.log('onHistoryMealChange', meal);
    if (!meal) return;
    setTodayMeal(meal);
  };

  const calculateTotal = (session, nutrient) => {
    const total = session.reduce((ac, i) => {
      return ac + i.realQty * i[nutrient];
    }, 0);
    return total;
  };
  const calculateTotalEatenFood = (session, nutrient) => {
    const total = session.reduce((ac, i) => {
      if (i.isDone) {
        return ac + i.realQty * i[nutrient];
      }
      return ac;
    }, 0);
    return total;
  };
  const getTodayFoodIndex = useCallback(() => {
    const breakfast = todayMeal.breakfast || [];
    const lunch = todayMeal.lunch || [];
    const dinner = todayMeal.dinner || [];
    const snacks = todayMeal.snacks || [];
    return nutrient => {
      const breakfastTotal = calculateTotal(breakfast, nutrient);
      const lunchTotal = calculateTotal(lunch, nutrient);
      const dinnerTotal = calculateTotal(dinner, nutrient);
      const snacksTotal = calculateTotal(snacks, nutrient);

      const breakfastEaten = calculateTotalEatenFood(breakfast, nutrient);
      const lunchEaten = calculateTotalEatenFood(lunch, nutrient);
      const dinnerEaten = calculateTotalEatenFood(dinner, nutrient);
      const snacksEaten = calculateTotalEatenFood(snacks, nutrient);
      const total = breakfastTotal + lunchTotal + dinnerTotal + snacksTotal;
      const absorb = breakfastEaten + lunchEaten + dinnerEaten + snacksEaten;
      return [total, absorb];
    };
  }, [todayMeal]);
  useEffect(() => {
    if (todayMeal) {
      const data = [
        'realCalories',
        'realFat',
        'realCarbo',
        'realProtein'
      ].reduce((acc, i) => {
        const [total, absorb] = getTodayFoodIndex()(i);
        acc[i] = {total, absorb};
        return acc;
      }, {});
      setFoodIndex(data);
    }
  }, [todayMeal]);
  useEffect(() => {
    if (user) {
      observeHistoryMealsToday(user.uid, onHistoryMealChange);
    }
  }, [user]);
  return {foodIndex};
}

export default useMeal;
