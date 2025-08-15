import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
});

client.interceptors.request.use((config) => {
  let token = localStorage.getItem('token') || '';
  // Si alguien lo guardó como JSON: "eyJ..." -> eyJ...
  token = token.replace(/^"+|"+$/g, '');
  // Si alguien lo guardó con "Bearer " al principio: -> quítalo
  token = token.replace(/^Bearer\s+/i, '');
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (r) => r,
  (error) => {
    const status = error?.response?.status;
    const data = error?.response?.data;
    console.warn('API error:', status, data);
    return Promise.reject(error);
  }
);

export default client;