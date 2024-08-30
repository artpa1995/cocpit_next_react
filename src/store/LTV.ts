import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LTVState {
  count: number;
}

const initialState: LTVState = {
  count: 0,
};

const LTVSlice = createSlice({
  name: 'LTV',
  initialState,
  reducers: {
    setLTV(state, action: PayloadAction<number>) {
      state.count = action.payload;
    },
  },
});

export const { setLTV } = LTVSlice.actions;
export default LTVSlice.reducer;
