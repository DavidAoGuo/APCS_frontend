// File: src/store/reducers/notificationReducer.js
import * as types from '../types';

const initialState = {
  notifications: [],
  loading: false,
  error: null,
};

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_NOTIFICATIONS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
      
    case types.FETCH_NOTIFICATIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        notifications: action.payload,
        error: null,
      };
      
    case types.FETCH_NOTIFICATIONS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
      
    case types.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
      };
      
    // Update to handle the SUCCESS action and use _id
    case types.MARK_NOTIFICATION_READ_SUCCESS:
      console.log('Processing MARK_NOTIFICATION_READ_SUCCESS with ID:', action.payload);
      return {
        ...state,
        loading: false,
        notifications: state.notifications.map(notification => {
          // Safely convert IDs to strings for comparison
          const notificationId = notification._id?.toString() || '';
          const payloadId = action.payload?.toString() || '';
          console.log(`Comparing: ${notificationId} === ${payloadId} => ${notificationId === payloadId}`);
          
          if (notificationId === payloadId) {
            console.log('Found matching notification, marking as read');
            return { ...notification, read: true };
          }
          return notification;
        }),
      };
      
    // Add the request/failure states
    case types.MARK_NOTIFICATION_READ_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
      
    case types.MARK_NOTIFICATION_READ_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
      
    // Update to handle the SUCCESS action
    case types.CLEAR_NOTIFICATIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        notifications: [],
        error: null,
      };
      
    // Add the request/failure states
    case types.CLEAR_NOTIFICATIONS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
      
    case types.CLEAR_NOTIFICATIONS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
      
    default:
      return state;
  }
};

export default notificationReducer;