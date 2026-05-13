import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InvestorPreferences } from '../../types';

interface Notification {
  id: string;
  message: string;
  read: boolean;
  timestamp: number;
}

interface UserState {
  interests: string[]; // List of deal IDs the user is interested in
  investments: string[]; // List of deal IDs the user has invested in
  notifications: Notification[];
  preferences: InvestorPreferences | null;
  isMobileMenuOpen: boolean;
}

const loadState = (): UserState => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('userState');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { investments: [], notifications: [], isMobileMenuOpen: false, ...parsed };
      } catch (e) {
        console.error('Failed to parse user state from localStorage', e);
      }
    }
  }
  return { interests: [], investments: [], notifications: [], preferences: null, isMobileMenuOpen: false };
};

const initialState: UserState = loadState();

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    toggleInterest(state, action: PayloadAction<string>) {
      const dealId = action.payload;
      if (state.interests.includes(dealId)) {
        state.interests = state.interests.filter(id => id !== dealId);
      } else {
        state.interests.push(dealId);
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('userState', JSON.stringify(state));
      }
    },
    setPreferences(state, action: PayloadAction<InvestorPreferences>) {
      state.preferences = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('userState', JSON.stringify(state));
      }
    },
    addInvestment(state, action: PayloadAction<string>) {
      const dealId = action.payload;
      if (!state.investments.includes(dealId)) {
        state.investments.push(dealId);
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('userState', JSON.stringify(state));
      }
    },
    toggleMobileMenu(state, action: PayloadAction<boolean | undefined>) {
      if (action.payload !== undefined) {
        state.isMobileMenuOpen = action.payload;
      } else {
        state.isMobileMenuOpen = !state.isMobileMenuOpen;
      }
    },
    addNotification(state, action: PayloadAction<string>) {
      state.notifications.unshift({
        id: Date.now().toString(),
        message: action.payload,
        read: false,
        timestamp: Date.now()
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem('userState', JSON.stringify(state));
      }
    },
    markNotificationsRead(state) {
      state.notifications.forEach(n => n.read = true);
      if (typeof window !== 'undefined') {
        localStorage.setItem('userState', JSON.stringify(state));
      }
    }
  }
});

export const { toggleInterest, setPreferences, addInvestment, toggleMobileMenu, addNotification, markNotificationsRead } = userSlice.actions;
export default userSlice.reducer;
