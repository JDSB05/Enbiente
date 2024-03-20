import axios from 'axios';


const api = axios.create({

  baseURL: process.env.API_URL || 'http://localhost:5000',

});
/*
api.interceptors.request.use(function (config) {
  const token = localStorage.getItem('token');

  config.headers.Authorization = token;

  return config;
});

*/
export default api;
