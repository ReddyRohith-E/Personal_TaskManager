import api from './api';

export const taskService = {
  getTasks: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });
    
    const response = await api.get(`/tasks?${params}`);
    return response.data;
  },

  getTask: async (id) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  createTask: async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  updateTask: async (id, taskData) => {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  deleteTask: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },

  markComplete: async (id) => {
    const response = await api.patch(`/tasks/${id}/complete`);
    return response.data;
  },

  getTasksWithCountdown: async () => {
    const response = await api.get('/tasks/countdown');
    return response.data;
  },

  getDashboardStats: async () => {
    const response = await api.get('/tasks/stats');
    return response.data;
  }
};
