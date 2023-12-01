import {ExerciseType} from './exercise.type';

export type PlanType = {
  name: string,
  createdAt: Date,
  exercise: ExerciseType[]
};
