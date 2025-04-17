import * as types from '../types';

const initialState = {
  schedules: [],
  loading: false,
  error: null
};

const scheduleReducer = (state = initialState, action) => {
  switch (action.type) {
    // Get Schedules
    case types.GET_SCHEDULES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case types.GET_SCHEDULES_SUCCESS:
      return {
        ...state,
        schedules: action.payload,
        loading: false,
        error: null
      };
    case types.GET_SCHEDULES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
      
    // Create Schedule
    case types.CREATE_SCHEDULE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case types.CREATE_SCHEDULE_SUCCESS:
      return {
        ...state,
        schedules: [...state.schedules, action.payload],
        loading: false,
        error: null
      };
    case types.CREATE_SCHEDULE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
      
    // Update Schedule
    case types.UPDATE_SCHEDULE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case types.UPDATE_SCHEDULE_SUCCESS:
      return {
        ...state,
        schedules: state.schedules.map(schedule => 
          schedule._id === action.payload._id ? action.payload : schedule
        ),
        loading: false,
        error: null
      };
    case types.UPDATE_SCHEDULE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
      
    // Delete Schedule
    case types.DELETE_SCHEDULE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case types.DELETE_SCHEDULE_SUCCESS:
      return {
        ...state,
        schedules: state.schedules.filter(schedule => schedule._id !== action.payload),
        loading: false,
        error: null
      };
    case types.DELETE_SCHEDULE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
      
    // Toggle Schedule
    case types.TOGGLE_SCHEDULE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case types.TOGGLE_SCHEDULE_SUCCESS:
      return {
        ...state,
        schedules: state.schedules.map(schedule => 
          schedule._id === action.payload._id ? action.payload : schedule
        ),
        loading: false,
        error: null
      };
    case types.TOGGLE_SCHEDULE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
      
    default:
      return state;
  }
};

export default scheduleReducer;