import axios from 'axios';
import {RAPID_API_KEY, RAPID_HOST} from '@env';

const axiosClient = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
    'X-RapidAPI-KEY': '4ff50f08eemsh71f325be441af71p1fee05jsnc76684fedd23',
    'X-RapidAPI-Host': RAPID_HOST
  }
});

export default axiosClient;
