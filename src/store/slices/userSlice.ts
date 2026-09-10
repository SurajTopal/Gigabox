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
  name: 'Suraj Topal',
  email: 'suraj@example.com',
  phone: '+91 9876543210',
  isLoggedIn: true,
  addresses: [
    {
      id: '1',
      title: 'Home',
      fullAddress: '123 Main Street, Sector 15, City',
      isDefault: true,
    },
    {
      id: '2',
      title: 'Office',
      fullAddress: 'Tech Park, Tower B, 4th Floor, Tech Hub',
      isDefault: false,
    },
  ],
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
