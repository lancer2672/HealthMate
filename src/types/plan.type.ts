import {ExerciseType} from './exercise.type';

export type PlanType = {
  id: string,
  planName: string,
  createdAt: Date,
  exercise: ExerciseType[]
};
