import axios from 'axios';
const api = axios.create({ baseURL: process.env.REACT_APP_API_URL || 'https://eldplanner-backend-production.up.railway.app/api' });
export default api;
