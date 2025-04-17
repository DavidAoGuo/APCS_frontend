// File: src/store/reducers/sensorReducer.js
import * as types from '../types';

const initialState = {
  foodLevel: 0,
  waterLevel: 0,
  temperature: 0,
  humidity: 0,
  lastUpdated: null,
  loading: false,
  error: null,
  history: {
    food: [],
    water: [],
    temperature: [],
    humidity: []
  },
  historyLoading: false,
  historyError: null
};

const sensorReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_SENSORS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
      
    case types.FETCH_SENSORS_SUCCESS:
      return {
        ...state,
        ...action.payload,
        loading: false,
        error: null,
      };
      
    case types.FETCH_SENSORS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
      
    case types.UPDATE_FOOD_LEVEL:
      return {
        ...state,
        foodLevel: action.payload,
        lastUpdated: new Date().toISOString(),
      };
      
    case types.UPDATE_WATER_LEVEL:
      return {
        ...state,
        waterLevel: action.payload,
        lastUpdated: new Date().toISOString(),
      };
      
    case types.UPDATE_TEMPERATURE:
      return {
        ...state,
        temperature: action.payload,
        lastUpdated: new Date().toISOString(),
      };
      
    case types.UPDATE_HUMIDITY:
      return {
        ...state,
        humidity: action.payload,
        lastUpdated: new Date().toISOString(),
      };

    case types.FETCH_SENSOR_HISTORY_REQUEST:
      return {
        ...state,
        historyLoading: true,
        historyError: null,
      };
      
    case types.FETCH_SENSOR_HISTORY_SUCCESS:
      return {
        ...state,
        history: {
          ...state.history,
          [action.payload.type]: action.payload.data
        },
        historyLoading: false,
        historyError: null,
      };
      
    case types.FETCH_SENSOR_HISTORY_FAILURE:
      return {
        ...state,
        historyLoading: false,
        historyError: action.payload,
      };
      
    default:
      return state;
  }
};

export default sensorReducer;