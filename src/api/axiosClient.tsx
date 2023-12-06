import axios from 'axios';
import {RAPID_API_KEY, RAPID_HOST} from '@env';

const axiosClient = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
    'X-RapidAPI-KEY': 'e8ea896f4cmshf9c9db258dc782ap1a18a2jsn91526e0254b4',
    'X-RapidAPI-Host': RAPID_HOST
  }
});

export default axiosClient;
