import axios from 'axios';

const api = axios.create({
  baseURL: 'https://bombcryptobot.herokuapp.com',
});

export default api;
