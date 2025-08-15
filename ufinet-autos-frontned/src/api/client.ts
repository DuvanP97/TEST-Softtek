import axios from 'axios';

function normalizeBaseUrl(u?: string) {
  if (!u) return 'http://localhost:8080';
  return u.replace(/\/+$/, ''); 
}

const baseURL = normalizeBaseUrl(import.meta.env.VITE_API_URL);

const client = axios.create({ baseURL });

client.interceptors.request.use((config) => {
  let token = localStorage.getItem('token') || '';
  token = token.replace(/^"+|"+$/g, '');
  token = token.replace(/^Bearer\s+/i, '');

  config.headers = config.headers ?? {};
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }

  const method = (config.method || 'GET').toUpperCase();
  const finalUrl = `${baseURL}${config.url?.startsWith('/') ? '' : '/'}${config.url || ''}`;
  console.log(`[API] ${method} ${finalUrl} | Auth?`, !!config.headers.Authorization);

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