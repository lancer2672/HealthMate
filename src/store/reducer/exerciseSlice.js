import AsyncStorage from '@react-native-async-storage/async-storage';
import {createSlice} from '@reduxjs/toolkit';
import {
  addExerciseAction,
  addPlanAction,
  getPlanAction,
  removeExerciseAction,
  removePlanAction,
  updateExerciseAction
} from './thunks/exerciseActions';

const initialState = {
  selectedPlan: {},
  plans: [],
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
    }
  },
  extraReducers: builder => {
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

export const {setSelectedPlan, setPlans} = exerciseSlice.actions;
