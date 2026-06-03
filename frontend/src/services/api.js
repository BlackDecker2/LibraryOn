import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const login    = (data) => api.post('/auth/login', data);
export const register = (data) => api.post('/auth/register', data);

// Posts
export const createPost    = (data) => api.post('/posts', data);
export const updatePost    = (id, data) => api.put(`/posts/${id}`, data);
export const deletePost    = (id) => api.delete(`/posts/${id}`);
export const publishPost   = (id) => api.patch(`/posts/${id}/publish`);
export const unpublishPost = (id) => api.patch(`/posts/${id}/unpublish`);
export const getMyPosts    = () => api.get('/posts/my');
export const getPublished  = (page = 0) =>
  api.get(`/posts/published?page=${page}&size=10&sort=createdAt,desc`);

// Admin
export const getAllUsers = () => api.get('/admin/users');
export const toggleUser = (id) => api.patch(`/admin/users/${id}/toggle-active`);
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);
export const getAllPosts = () => api.get('/admin/posts');

export default api;
