import {RAPID_HOST} from '@env';
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
    'X-RapidAPI-KEY': '217d0499acmsh0f6c31afec41a55p11fd9bjsn3256991db699',
    'X-RapidAPI-Host': RAPID_HOST
  }
});

export default axiosClient;
