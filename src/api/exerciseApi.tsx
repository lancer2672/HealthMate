import {EXERCISE_BASE_URL} from 'src/constants';
import axiosClient from './axiosClient';

const exerciseApi = {
  getAll: async limit => {
    try {
      const data = await axiosClient.get(`${EXERCISE_BASE_URL}`, {
        params: {limit}
      });
      return data.data;
    } catch (er) {
      console.log('er', er);
    }
  },
  getListBodyPart: async () => {
    const data = await axiosClient.get(`${EXERCISE_BASE_URL}/bodyPartList`, {});
    return data.data;
  },
  getTargetList: async () => {
    const data = await axiosClient.get(`${EXERCISE_BASE_URL}/targetList`, {});
    return data.data;
  },
  getTargetExercise: async (target, limit) => {
    const data = await axiosClient.get(
      `${EXERCISE_BASE_URL}/target/${target}`,
      {
        params: {
          limit
        }
      }
    );
    return data.data;
  },
  getExerciseByBodyPart: async ({bodyPart, limit}) => {
    const data = await axiosClient.get(
      `${EXERCISE_BASE_URL}/bodyPart/${bodyPart}`,
      {
        params: {
          limit
        }
      }
    );
    return data.data;
  }
};

export default exerciseApi;
