import { configureStore } from '@reduxjs/toolkit';
import dealsReducer from '../features/deals/dealsSlice';
import userReducer from '../features/user/userSlice';

export const store = configureStore({
  reducer: {
    deals: dealsReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
