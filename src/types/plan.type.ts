import {ExerciseType} from './exercise.type';

export type PlanType = {
  planName: string,
  createdAt: Date,
  exercise: ExerciseType[]
};
