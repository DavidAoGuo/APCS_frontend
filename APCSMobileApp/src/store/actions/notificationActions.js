// File: src/store/actions/notificationActions.js
import * as notificationService from '../../services/api/notificationService';
import * as types from '../types';

// Fetch notifications
export const fetchNotifications = () => {
  return async dispatch => {
    dispatch({ type: types.FETCH_NOTIFICATIONS_REQUEST });
    
    try {
      const response = await notificationService.getNotifications();
      
      dispatch({
        type: types.FETCH_NOTIFICATIONS_SUCCESS,
        payload: response.data,
      });
      
      return Promise.resolve(response.data);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch notifications';
      
      dispatch({
        type: types.FETCH_NOTIFICATIONS_FAILURE,
        payload: errorMessage,
      });
      
      return Promise.reject(new Error(errorMessage));
    }
  };
};

// Mark notification as read
export const markNotificationRead = (id) => {
  return async dispatch => {
    console.log('markNotificationRead action - ID:', id, 'Type:', typeof id);
    dispatch({ type: types.MARK_NOTIFICATION_READ_REQUEST });
    
    try {
      // Call the service method
      await notificationService.markNotificationAsRead(id);
      
      // Dispatch success action with the notification ID
      dispatch({
        type: types.MARK_NOTIFICATION_READ_SUCCESS,
        payload: id,
      });
      
      console.log('Mark notification read success - ID:', id);
      return Promise.resolve({ success: true });
    } catch (error) {
      console.error('Error in markNotificationRead action:', error);
      const errorMessage = error.response?.data?.message || 'Failed to mark notification as read';
      
      dispatch({
        type: types.MARK_NOTIFICATION_READ_FAILURE,
        payload: errorMessage,
      });
      
      return Promise.reject(new Error(errorMessage));
    }
  };
};

// Clear all notifications
export const clearNotifications = () => {
  return async dispatch => {
    dispatch({ type: types.CLEAR_NOTIFICATIONS_REQUEST });
    
    try {
      await notificationService.clearNotifications();
      
      dispatch({
        type: types.CLEAR_NOTIFICATIONS_SUCCESS,
      });
      
      return Promise.resolve({ success: true });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to clear notifications';
      
      dispatch({
        type: types.CLEAR_NOTIFICATIONS_FAILURE,
        payload: errorMessage,
      });
      
      return Promise.reject(new Error(errorMessage));
    }
  };
};