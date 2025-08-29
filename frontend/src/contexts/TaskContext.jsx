import { createContext, useContext, useReducer, useEffect } from 'react';
import { taskService } from '../services/taskService';
import { useSocket } from './SocketContext';

const TaskContext = createContext();

const taskReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_TASKS':
      return { ...state, tasks: action.payload, loading: false };
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task._id === action.payload._id ? action.payload : task
        )
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task._id !== action.payload)
      };
    case 'SET_STATS':
      return { ...state, stats: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

export const TaskProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, {
    tasks: [],
    stats: null,
    loading: false,
    error: null,
  });

  const socket = useSocket();

  useEffect(() => {
    if (socket) {
      socket.on('taskUpdated', (task) => {
        dispatch({ type: 'UPDATE_TASK', payload: task });
      });

      socket.on('taskCompleted', (task) => {
        dispatch({ type: 'UPDATE_TASK', payload: task });
      });

      return () => {
        socket.off('taskUpdated');
        socket.off('taskCompleted');
      };
    }
  }, [socket]);

  const fetchTasks = async (filters = {}) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await taskService.getTasks(filters);
      dispatch({ type: 'SET_TASKS', payload: response.data.tasks });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.error || 'Failed to fetch tasks' });
    }
  };

  const createTask = async (taskData) => {
    try {
      const response = await taskService.createTask(taskData);
      dispatch({ type: 'ADD_TASK', payload: response.data.task });
      return response;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.error || 'Failed to create task' });
      throw error;
    }
  };

  const updateTask = async (id, taskData) => {
    try {
      const response = await taskService.updateTask(id, taskData);
      dispatch({ type: 'UPDATE_TASK', payload: response.data.task });
      return response;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.error || 'Failed to update task' });
      throw error;
    }
  };

  const deleteTask = async (id) => {
    try {
      await taskService.deleteTask(id);
      dispatch({ type: 'DELETE_TASK', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.error || 'Failed to delete task' });
      throw error;
    }
  };

  const markComplete = async (id) => {
    try {
      const response = await taskService.markComplete(id);
      dispatch({ type: 'UPDATE_TASK', payload: response.data.task });
      return response;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.error || 'Failed to mark task complete' });
      throw error;
    }
  };

  const fetchStats = async () => {
    try {
      const response = await taskService.getDashboardStats();
      dispatch({ type: 'SET_STATS', payload: response.data.stats });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.error || 'Failed to fetch stats' });
    }
  };

  return (
    <TaskContext.Provider value={{
      ...state,
      fetchTasks,
      createTask,
      updateTask,
      deleteTask,
      markComplete,
      fetchStats,
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
