import axios from 'axios';

const api = axios.create({
  baseURL: 'https://cidadeativa.herokuapp.com',
});

export default api;
