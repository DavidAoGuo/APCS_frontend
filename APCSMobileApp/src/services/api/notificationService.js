// File: src/services/api/notificationService.js
import { API_ENDPOINTS } from '../../utils/constants';
import apiClient from './apiClient';

export const getNotifications = async () => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.NOTIFICATIONS);
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

export const markNotificationAsRead = async (id) => {
  try {
    const response = await apiClient.patch(`${API_ENDPOINTS.NOTIFICATIONS}/${id}/read`);
    return response.data;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

export const markAllNotificationsAsRead = async () => {
  try {
    const response = await apiClient.patch(`${API_ENDPOINTS.NOTIFICATIONS}/read-all`);
    return response.data;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

export const deleteAllNotifications = async () => {
  try {
    await apiClient.delete(API_ENDPOINTS.NOTIFICATIONS);
    return true;
  } catch (error) {
    console.error('Error deleting all notifications:', error);
    throw error;
  }
};

export const markNotificationRead = async (id) => {
  try {
    console.log(`Making API call to mark notification as read - ID: ${id}`);
    const response = await apiClient.patch(`${API_ENDPOINTS.NOTIFICATIONS}/${id}/read`);
    console.log(`API call response:`, response.data);
    return response.data;
  } catch (error) {
    console.error('Error in markNotificationRead service:', error);
    console.error('Response status:', error.response?.status);
    console.error('Response data:', error.response?.data);
    throw error;
  }
};