import { configureStore } from '@reduxjs/toolkit';
import ballsReducer from './ballsSlice';

export const store = configureStore({
  reducer: {
    game: ballsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
