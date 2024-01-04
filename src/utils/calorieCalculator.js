import {
  CALORIE_DEFICLIT_DEFAULT,
  CALORIE_SURPLUS_RATE_DEFAULT,
  GENDER
} from 'src/constants';

export const getCalorieTdee = ({gender, age, height, weight, lifestyle}) => {
  let bmr = 0;

  if (gender === GENDER.MALE) {
    // Use the Harris-Benedict equation for males to calculate BMR
    bmr = 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;
  } else {
    bmr = 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age;
  }
  return bmr * lifestyle;
};

export const calculateCaloriesForWeightLoss = tdee => {
  const calorieDeficit = CALORIE_DEFICLIT_DEFAULT;
  const caloriesForWeightLoss = tdee - calorieDeficit;

  return caloriesForWeightLoss;
};

// Function to calculate calories for getting fitter
export const calculateCaloriesForFitter = tdee => {
  const calorieSurplusPercentage = CALORIE_SURPLUS_RATE_DEFAULT;
  const caloriesForFitter = tdee + tdee * calorieSurplusPercentage;

  return caloriesForFitter;
};
