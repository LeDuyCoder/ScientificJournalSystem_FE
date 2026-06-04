import axios from 'axios';

// Base Axios instance pointing to the backend API base URL
const api = axios.create({
  baseURL: 'https://scientificjournalsystem-be-nodejs.onrender.com/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
