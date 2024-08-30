// redux/activeClientsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ActiveClientsState {
  count: number;
}

const initialState: ActiveClientsState = {
  count: 0,
};

const activeClientsSlice = createSlice({
  name: 'activeClients',
  initialState,
  reducers: {
    setActiveClients(state, action: PayloadAction<number>) {
      state.count = action.payload;
    },
  },
});

export const { setActiveClients } = activeClientsSlice.actions;
export default activeClientsSlice.reducer;
