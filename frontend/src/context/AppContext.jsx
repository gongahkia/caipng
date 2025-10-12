/**
 * Application Context
 * Manages global state for preferences, analyzed dishes, and user data
 */

import { createContext, useContext, useReducer, useEffect } from 'react';

const AppContext = createContext();

// Initial state
const initialState = {
  preferences: null,
  analyzedDishes: [],
  selectedDishes: [],
  recommendations: [],
  user: null,
};

// Action types
const SET_PREFERENCES = 'SET_PREFERENCES';
const SET_ANALYZED_DISHES = 'SET_ANALYZED_DISHES';
const ADD_SELECTED_DISH = 'ADD_SELECTED_DISH';
const REMOVE_SELECTED_DISH = 'REMOVE_SELECTED_DISH';
const CLEAR_SELECTED_DISHES = 'CLEAR_SELECTED_DISHES';
const SET_RECOMMENDATIONS = 'SET_RECOMMENDATIONS';
const SET_USER = 'SET_USER';

// Reducer
function appReducer(state, action) {
  switch (action.type) {
    case SET_PREFERENCES:
      return { ...state, preferences: action.payload };
    
    case SET_ANALYZED_DISHES:
      return { ...state, analyzedDishes: action.payload };
    
    case ADD_SELECTED_DISH:
      if (state.selectedDishes.find(d => d._id === action.payload._id)) {
        return state;
      }
      return { ...state, selectedDishes: [...state.selectedDishes, action.payload] };
    
    case REMOVE_SELECTED_DISH:
      return {
        ...state,
        selectedDishes: state.selectedDishes.filter(d => d._id !== action.payload)
      };
    
    case CLEAR_SELECTED_DISHES:
      return { ...state, selectedDishes: [] };
    
    case SET_RECOMMENDATIONS:
      return { ...state, recommendations: action.payload };
    
    case SET_USER:
      return { ...state, user: action.payload };
    
    default:
      return state;
  }
}

// Provider component
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedPreferences = localStorage.getItem('caipng_preferences');
    if (savedPreferences) {
      try {
        dispatch({ type: SET_PREFERENCES, payload: JSON.parse(savedPreferences) });
      } catch (error) {
        console.error('Error loading preferences:', error);
      }
    }

    const savedUser = localStorage.getItem('caipng_user');
    if (savedUser) {
      try {
        dispatch({ type: SET_USER, payload: JSON.parse(savedUser) });
      } catch (error) {
        console.error('Error loading user:', error);
      }
    }
  }, []);

  // Save preferences to localStorage when they change
  useEffect(() => {
    if (state.preferences) {
      localStorage.setItem('caipng_preferences', JSON.stringify(state.preferences));
    }
  }, [state.preferences]);

  // Actions
  const actions = {
    setPreferences: (preferences) => {
      dispatch({ type: SET_PREFERENCES, payload: preferences });
    },
    
    setAnalyzedDishes: (dishes) => {
      dispatch({ type: SET_ANALYZED_DISHES, payload: dishes });
    },
    
    addSelectedDish: (dish) => {
      dispatch({ type: ADD_SELECTED_DISH, payload: dish });
    },
    
    removeSelectedDish: (dishId) => {
      dispatch({ type: REMOVE_SELECTED_DISH, payload: dishId });
    },
    
    clearSelectedDishes: () => {
      dispatch({ type: CLEAR_SELECTED_DISHES });
    },
    
    setRecommendations: (recommendations) => {
      dispatch({ type: SET_RECOMMENDATIONS, payload: recommendations });
    },
    
    setUser: (user) => {
      dispatch({ type: SET_USER, payload: user });
      if (user) {
        localStorage.setItem('caipng_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('caipng_user');
      }
    },
  };

  return (
    <AppContext.Provider value={{ state, ...actions }}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to use the context
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

