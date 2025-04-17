// src/store/actions/scheduleActions.js
import apiClient from '../../services/api/apiClient';
import * as types from '../types';

// Get all schedules
export const getSchedules = () => {
  return async dispatch => {
    dispatch({ type: types.GET_SCHEDULES_REQUEST });
    
    try {
      const response = await apiClient.get('/schedules');
      
      dispatch({
        type: types.GET_SCHEDULES_SUCCESS,
        payload: response.data.data
      });
      
      return Promise.resolve(response.data.data);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch schedules';
      
      dispatch({
        type: types.GET_SCHEDULES_FAILURE,
        payload: errorMessage
      });
      
      return Promise.reject(new Error(errorMessage));
    }
  };
};

// Create a new schedule
export const createSchedule = (scheduleData) => {
  return async dispatch => {
    dispatch({ type: types.CREATE_SCHEDULE_REQUEST });
    
    try {
      const response = await apiClient.post('/schedules', scheduleData);
      
      dispatch({
        type: types.CREATE_SCHEDULE_SUCCESS,
        payload: response.data.data
      });
      
      return Promise.resolve(response.data.data);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create schedule';
      
      dispatch({
        type: types.CREATE_SCHEDULE_FAILURE,
        payload: errorMessage
      });
      
      return Promise.reject(new Error(errorMessage));
    }
  };
};

// Update a schedule
export const updateSchedule = (id, scheduleData) => {
  return async dispatch => {
    dispatch({ type: types.UPDATE_SCHEDULE_REQUEST });
    
    try {
      const response = await apiClient.put(`/schedules/${id}`, scheduleData);
      
      dispatch({
        type: types.UPDATE_SCHEDULE_SUCCESS,
        payload: response.data.data
      });
      
      return Promise.resolve(response.data.data);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update schedule';
      
      dispatch({
        type: types.UPDATE_SCHEDULE_FAILURE,
        payload: errorMessage
      });
      
      return Promise.reject(new Error(errorMessage));
    }
  };
};

// Delete a schedule
export const deleteSchedule = (id) => {
  return async dispatch => {
    dispatch({ type: types.DELETE_SCHEDULE_REQUEST });
    
    try {
      await apiClient.delete(`/schedules/${id}`);
      
      dispatch({
        type: types.DELETE_SCHEDULE_SUCCESS,
        payload: id
      });
      
      return Promise.resolve(true);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete schedule';
      
      dispatch({
        type: types.DELETE_SCHEDULE_FAILURE,
        payload: errorMessage
      });
      
      return Promise.reject(new Error(errorMessage));
    }
  };
};

// Toggle schedule enabled status
export const toggleSchedule = (id, enabled) => {
  return async dispatch => {
    dispatch({ type: types.TOGGLE_SCHEDULE_REQUEST });
    
    try {
      const response = await apiClient.patch(`/schedules/${id}/toggle`, { enabled });
      
      dispatch({
        type: types.TOGGLE_SCHEDULE_SUCCESS,
        payload: response.data.data
      });
      
      return Promise.resolve(response.data.data);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to toggle schedule';
      
      dispatch({
        type: types.TOGGLE_SCHEDULE_FAILURE,
        payload: errorMessage
      });
      
      return Promise.reject(new Error(errorMessage));
    }
  };
};