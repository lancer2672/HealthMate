import axios from 'axios';
import {RAPID_API_KEY, RAPID_HOST} from '@env';

const axiosClient = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
    'X-RapidAPI-KEY': 'b837046020msh18bc9c45e6d4d8ap161e7fjsn20c312760867',
    'X-RapidAPI-Host': RAPID_HOST
  }
});

export default axiosClient;
