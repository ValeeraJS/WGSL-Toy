import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import shaderReducer from '../features/editor/shaderSlice';
import logReducer from '../features/editor/logSlice';
import runtimeReducer from '../features/editor/runtimeSlice';

export const store = configureStore({
  reducer: {
    shader: shaderReducer,
    logInfo: logReducer,
    runtime: runtimeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
