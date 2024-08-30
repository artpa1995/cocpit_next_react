import { configureStore } from '@reduxjs/toolkit';
import settingsReducer from '../store/settingsSlice';
import settingsActiveClients from '../store/ActiveClients';
import settingsLTV from '../store/LTV';

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    ActiveClients: settingsActiveClients,
    LTV: settingsLTV,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;