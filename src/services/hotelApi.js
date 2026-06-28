import axios from 'axios';

const hotelApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 8000,
});

hotelApi.interceptors.request.use((config) => {
  let session = null;

  try {
    const storedSession = localStorage.getItem('luxestay.clientSession');
    session = storedSession ? JSON.parse(storedSession) : null;
  } catch {
    session = null;
  }

  if (session?.token) {
    config.headers.Authorization = `Bearer ${session.token}`;
  }

  return config;
});

export default hotelApi;
