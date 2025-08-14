import axios from 'axios'

const client = axios.create({
  baseURL: '/', // Vite proxeará /api al backend
})

// Interceptor para JWT (cuando lo tengamos)
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default client