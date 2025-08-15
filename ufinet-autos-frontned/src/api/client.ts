import axios from 'axios';

function normalizeBaseUrl(u?: string) {
  if (!u) return 'http://localhost:8080';
  return u.replace(/\/+$/, ''); // quita barra final
}

const baseURL = normalizeBaseUrl(import.meta.env.VITE_API_URL);

const client = axios.create({ baseURL });

client.interceptors.request.use((config) => {
  let token = localStorage.getItem('token') || '';
  // Quita comillas si alguien lo guardó como stringizado
  token = token.replace(/^"+|"+$/g, '');
  // Quita un "Bearer " previo si lo guardaron así
  token = token.replace(/^Bearer\s+/i, '');

  config.headers = config.headers ?? {};
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }

  // Log de depuración: método, URL final y si lleva Authorization
  const method = (config.method || 'GET').toUpperCase();
  const finalUrl = `${baseURL}${config.url?.startsWith('/') ? '' : '/'}${config.url || ''}`;
  // OJO: no logueamos el token, solo si existe.
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