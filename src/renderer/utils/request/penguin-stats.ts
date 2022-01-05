import axios from 'axios';

const request = axios.create({
  baseURL: 'https://penguin-stats.io/PenguinStats/api/v2',
  withCredentials: true,
});

export default request;
