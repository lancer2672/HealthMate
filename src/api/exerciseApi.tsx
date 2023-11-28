import {EXERCISE_BASE_URL} from 'src/constants';
import axiosClient from './axiosClient';

const exerciseApi = {
  getAll: async () => {
    try {
      const data = await axiosClient.get(`${EXERCISE_BASE_URL}`);
      return data.data;
    } catch (er) {
      console.log('er', er);
    }
  },
  getListBodyPart: async () => {
    const data = await axiosClient.get(`${EXERCISE_BASE_URL}/bodyPartList `);
    return data.data;
  },
  getExerciseByBodyPart: async bodyPart => {
    const data = await axiosClient.get(
      `${EXERCISE_BASE_URL}/bodyPart/${bodyPart}`
    );
    return data.data;
  }
};

export default exerciseApi;
