import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserProfile {
  username?: string | null;
  displayName?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
  balanceCents?: number;
  _id?: string | null;
  [key: string]: any;
}

interface UserState {
  token: string | null;
  profile: UserProfile | null;
}

const initialState: UserState = {
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  profile: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
      try {
        if (action.payload) localStorage.setItem('token', action.payload);
        else localStorage.removeItem('token');
      } catch {}
    },
    setProfile(state, action: PayloadAction<UserProfile | null>) {
      state.profile = action.payload;
    },
    updateProfileFields(state, action: PayloadAction<Partial<UserProfile>>) {
      state.profile = { ...(state.profile || {}), ...(action.payload || {}) };
    },
    clearUser(state) {
      state.profile = null;
      state.token = null;
      try { localStorage.removeItem('token'); } catch {}
    },
  },
});

export const { setToken, setProfile, updateProfileFields, clearUser } = userSlice.actions;
export default userSlice.reducer;
