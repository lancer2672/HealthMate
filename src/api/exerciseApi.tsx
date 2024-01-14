import {EXERCISE_BASE_URL, SERVER_URL} from 'src/constants';
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
    try {
      console.log('GetListBodyPart');
      const data = await axiosClient.get(
        `${EXERCISE_BASE_URL}/bodyPartList`,
        {}
      );
      console.log('GetListBodyPart data', data);

      return data.data;
    } catch (er) {
      console.error('GetListBodyPart', er);
    }
  },
  getTargetList: async () => {
    const data = await axiosClient.get(`${EXERCISE_BASE_URL}/targetList`, {});
    return data.data;
  },
  getExerciseById: async id => {
    const data = await axiosClient.get(
      `${EXERCISE_BASE_URL}/exercise/${id}`,
      {}
    );
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
  },
  shareResult: async ({userIds}) => {
    const data = await axiosClient.get(`${SERVER_URL}/send-notification/`, {
      params: {
        userIds
      }
    });
    return data.data;
  }
};

export default exerciseApi;
