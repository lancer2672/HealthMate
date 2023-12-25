import {RAPID_HOST} from '@env';
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
    'X-RapidAPI-KEY': '76692100bfmsh12db6b3c511fe06p1d86aajsn80727a805449',
    'X-RapidAPI-Host': RAPID_HOST
  }
});

export default axiosClient;
