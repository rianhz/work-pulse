import { ITenant } from '@/features/tenants/tenant';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TenantState {
  tenant: ITenant | null;
}

const initialState: TenantState = {
  tenant: null,
};

const tenantSlice = createSlice({
  name: 'tenant',
  initialState,
  reducers: {
    setTenant: (state, action: PayloadAction<ITenant>) => {
      state.tenant = action.payload;
    },
    clearTenant: (state) => {
      state.tenant = null;
    },
  },
});

export const { setTenant, clearTenant } = tenantSlice.actions;
export default tenantSlice.reducer;