import {createSlice} from '@reduxjs/toolkit';
import {
  addExerciseAction,
  addPlanAction,
  removeExerciseAction,
  removePlanAction,
  saveHistoryExerciseAction,
  updateDailyWorkoutPlanAction,
  updatePlanExerciseAction,
  updateWorkoutPlanAction
} from './thunks/exerciseActions';

const initialState = {
  selectedPlan: {},
  currentExercise: null,
  plans: [],
  doExercise: [],
  workoutPlan: {},
  isLoading: false,
  error: null
};
// createPlanAction
const actions = [addPlanAction, addExerciseAction];
const exerciseAction = [removeExerciseAction, updatePlanExerciseAction];

export const exerciseSlice = createSlice({
  name: 'exercise',
  initialState: initialState,
  reducers: {
    setSelectedPlan: (state, action) => {
      state.selectedPlan = action.payload;
    },
    setPlans: (state, action) => {
      const plans = action.payload;
      state.plans = plans.filter(p => !p.deletedAt);
    },
    setWorkoutPlan: (state, action) => {
      state.workoutPlan = action.payload;
    },
    setCurrentExercise: (state, action) => {
      state.currentExercise = action.payload;
    },
    setDoExercise: (state, action) => {
      state.doExercise = action.payload;
    }
  },
  extraReducers: builder => {
    builder.addCase(updateWorkoutPlanAction.fulfilled, (state, action) => {
      console.log('updateWorkoutPlanAction.fulfilled', action.payload);
      state.workoutPlan = action.payload;
    });
    builder.addCase(updateDailyWorkoutPlanAction.fulfilled, (state, action) => {
      state.workoutPlan = action.payload;
    });
    builder.addCase(removePlanAction.fulfilled, (state, action) => {
      state.plans = action.payload;
    });
    builder.addCase(saveHistoryExerciseAction.fulfilled, (state, action) => {
      // state.doExercise = [];
    });
    actions.forEach(action => {
      builder
        .addCase(action.pending, state => {
          state.isLoading = true;
        })
        .addCase(action.fulfilled, (state, action) => {
          state.isLoading = false;
          console.log('action.payload', action.payload);
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
          const newSelectedPlan = action.payload;
          state.selectedPlan = newSelectedPlan;
          state.plans = state.plans.map(plan =>
            plan.id === newSelectedPlan.id ? newSelectedPlan : plan
          );
        })
        .addCase(action.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.error.message;
          console.log('error', action.error);
        });
    });
  }
});

export const {
  setSelectedPlan,
  setDoExercise,
  setCurrentExercise,
  setWorkoutPlan,
  setPlans
} = exerciseSlice.actions;
