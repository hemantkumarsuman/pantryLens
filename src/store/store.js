import { configureStore } from '@reduxjs/toolkit';
import pantryReducer from './pantrySlice';

export const store = configureStore({
  reducer: {
    pantry: pantryReducer,
  },
});
