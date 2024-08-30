// settingsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Currency {
    id: string;
    name: string;
    icon: string;
}

interface SettingsState {
  time_zone: string;
  start_date: string;
  end_date: string;
  week_days: string;
  currency: Currency | null;
}

const initialState: SettingsState = {
  time_zone: '',
  start_date: '',
  end_date: '',
  week_days: '',
  currency: null,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateSettings: (state, action: PayloadAction<SettingsState>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { updateSettings } = settingsSlice.actions;

export default settingsSlice.reducer;
