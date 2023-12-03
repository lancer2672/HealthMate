import AsyncStorage from '@react-native-async-storage/async-storage';
import {createSlice} from '@reduxjs/toolkit';
import {
  addExerciseAction,
  addPlanAction,
  getPlanAction,
  removeExerciseAction,
  removePlanAction,
  updateDailyWorkoutPlanAction,
  updateExerciseAction,
  updateWorkoutPlanAction
} from './thunks/exerciseActions';

const initialState = {
  selectedPlan: {},
  plans: [],
  workoutPlan: {},
  isLoading: false,
  error: null
};
// createPlanAction
const actions = [addPlanAction, removePlanAction];
const exerciseAction = [
  addExerciseAction,
  removeExerciseAction,
  updateExerciseAction
];

export const exerciseSlice = createSlice({
  name: 'exercise',
  initialState: initialState,
  reducers: {
    setSelectedPlan: (state, action) => {
      state.selectedPlan = action.payload;
    },
    setPlans: (state, action) => {
      state.plans = action.payload;
    },
    setWorkoutPlan: (state, action) => {
      state.workoutPlan = action.payload;
    }
  },
  extraReducers: builder => {
    builder.addCase(updateWorkoutPlanAction.fulfilled, (state, action) => {
      state.workoutPlan = action.payload;
    });
    builder.addCase(updateDailyWorkoutPlanAction.fulfilled, (state, action) => {
      state.workoutPlan = action.payload;
    });
    actions.forEach(action => {
      builder
        .addCase(action.pending, state => {
          state.isLoading = true;
        })
        .addCase(action.fulfilled, (state, action) => {
          state.isLoading = false;
          state.plans = action.payload;
        })
        .addCase(action.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.error.message;
          console.log('error', action.error);
        });
    });
    exerciseAction.forEach(action => {
      builder
        .addCase(action.pending, state => {
          state.isLoading = true;
        })
        .addCase(action.fulfilled, (state, action) => {
          state.isLoading = false;
          state.selectedPlan = action.payload;
        })
        .addCase(action.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.error.message;
          console.log('error', action.error);
        });
    });
  }
});

export const {setSelectedPlan, setWorkoutPlan, setPlans} =
  exerciseSlice.actions;
