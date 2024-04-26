import axios from 'axios';

const api = axios.create({


  //baseURL: 'https://enbiente.onrender.com/api',
  baseURL: process.env.REACT_APP_API_LINK,

});

api.interceptors.request.use(function (config) {
  const token = localStorage.getItem('token');

  config.headers.Authorization = token;

  return config;
});



export default api;
