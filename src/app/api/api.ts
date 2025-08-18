import axios from 'axios';
import { getSession, signOut } from 'next-auth/react';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const session = await getSession();

    // @ts-ignore
    if (session?.accessToken) {
      // @ts-ignore
      config.headers['Authorization'] = `Bearer ${session.accessToken}`;
    }

    return config;
  },
  (error) => {
    console.error('Erro na requisição:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response.data.message) {
      if (Array.isArray(error.response.data.message)) {
        return Promise.reject(error.response.data.message.join('\n'));
      } else {
        return Promise.reject(error.response.data.message);
      }
    }
    if (error.response?.status === 401) {
      signOut();
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);



export default api;