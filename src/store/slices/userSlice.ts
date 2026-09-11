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
  isLoggedIn: boolean;
  addresses: Address[];
}

const initialState: UserState = {
  name: '',
  email: '',
  phone: '',
  isLoggedIn: false,
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

export const { setUserProfile, addAddress, setDefaultAddress, logout } =
  userSlice.actions;

export default userSlice.reducer;
