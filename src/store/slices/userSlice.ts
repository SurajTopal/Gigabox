import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Address {
  id: string;
  title: string;
  fullAddress: string;
  isDefault: boolean;
}

export interface UserState {
  name: string;
  email: string;
  phone: string;
  address: string;
  isLoggedIn: boolean;
  addresses: Address[];
}

const initialState: UserState = {
  name: 'Suraj Topal',
  email: 'suraj@b4igodev.com',
  phone: '+91 98765 43210',
  address: 'Indian Luxury PG, Veerannapalya Main Rd, Nagavara, Bengaluru 560045',
  isLoggedIn: true,
  addresses: [],
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserProfile: (
      state,
      action: PayloadAction<Partial<Omit<UserState, 'addresses'>>>,
    ) => {
      return { ...state, ...action.payload };
    },
    // Applied once at startup from AsyncStorage. Merged rather than replaced so
    // a profile saved before a field existed still gets that field's default.
    hydrateUser: (
      state,
      action: PayloadAction<Partial<Omit<UserState, 'addresses'>>>,
    ) => {
      return { ...state, ...action.payload };
    },
    addAddress: (state, action: PayloadAction<Omit<Address, 'id'>>) => {
      const newAddress: Address = {
        ...action.payload,
        id: Date.now().toString(),
      };
      if (newAddress.isDefault) {
        state.addresses.forEach(addr => (addr.isDefault = false));
      }
      state.addresses.push(newAddress);
    },
    setDefaultAddress: (state, action: PayloadAction<string>) => {
      state.addresses.forEach(addr => {
        addr.isDefault = addr.id === action.payload;
      });
    },
    logout: state => {
      state.isLoggedIn = false;
    },
  },
});

export const {
  setUserProfile,
  hydrateUser,
  addAddress,
  setDefaultAddress,
  logout,
} = userSlice.actions;

export default userSlice.reducer;
