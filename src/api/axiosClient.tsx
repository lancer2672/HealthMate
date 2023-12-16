import axios from 'axios';
import {RAPID_API_KEY, RAPID_HOST} from '@env';

const UrlAPI = 'http://10.0.31.80:3000';
const axiosClient = axios.create({
  baseURL: UrlAPI,
  headers: {
    'Content-Type': 'application/json',
    // 'X-RapidAPI-KEY': '885131f8a3msh35a2dadbfc16193p152129jsne637c2c5354b',
    'X-RapidAPI-Host': RAPID_HOST
  }
});

export default axiosClient;
