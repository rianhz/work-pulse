import { configureStore } from '@reduxjs/toolkit';
import userSlice from './reducers/userSlice'; 
import tenantSlice from './reducers/tenantSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      currentUser: userSlice,
      currentTenant: tenantSlice,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];