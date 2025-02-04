import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true
});

// Intercepteur pour ajouter le token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Service d'authentification
export const authService = {
    register: (userData: {
      username: string;
      email: string;
      password: string;
      firstName?: string;
      lastName?: string;
    }) => api.post('/auth/register', userData),
  
    login: (credentials: {
      email: string;
      password: string;
    }) => api.post('/auth/login', credentials),
  
    forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  
    resetPassword: (data: {
      token: string;
      newPassword: string;
    }) => api.post('/auth/reset-password', data),
  
    refreshToken: () => api.post('/auth/refresh-token'),
  
    getUserProfile: () => api.get('/auth/profile')
  };
  
  // Service de recettes
  export const recipeService = {
    getAllRecipes: (params?: {
      page?: number;
      limit?: number;
    }) => api.get('/recipes', { params }),
  
    getRecipeById: (id: string) => api.get(`/recipes/${id}`),
  
    createRecipe: (recipeData: any) => api.post('/recipes', recipeData),
  
    updateRecipe: (id: string, recipeData: any) => api.put(`/recipes/${id}`, recipeData),
  
    deleteRecipe: (id: string) => api.delete(`/recipes/${id}`),
  
    searchRecipes: (params: {
      region?: string;
      difficulty?: string;
      minCalories?: number;
      maxCalories?: number;
      tags?: string[];
    }) => api.get('/recipes/search', { params }),
  
    addComment: (recipeId: string, commentData: {
      content: string;
      rating: number;
    }) => api.post(`/recipes/${recipeId}/comment`, commentData),
  
    getRecommendedRecipes: () => api.get('/recipes/recommended')
  };
  
  export default api;