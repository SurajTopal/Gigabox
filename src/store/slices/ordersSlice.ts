import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Order {
  id: string;
  date: string;
  itemsCount: number;
  totalAmount: number;
  status: 'Delivered' | 'In Transit' | 'Cancelled' | 'Processing';
}

export interface OrdersState {
  orders: Order[];
  isLoading: boolean;
}

const initialState: OrdersState = {
  orders: [
    {
      id: 'GB-98214',
      date: 'Sep 08, 2026',
      itemsCount: 3,
      totalAmount: 1499,
      status: 'Delivered',
    },
    {
      id: 'GB-97810',
      date: 'Sep 02, 2026',
      itemsCount: 1,
      totalAmount: 499,
      status: 'Delivered',
    },
  ],
  isLoading: false,
};

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
    },
    addOrder: (state, action: PayloadAction<Omit<Order, 'id'>>) => {
      const newOrder: Order = {
        ...action.payload,
        id: `GB-${Math.floor(10000 + Math.random() * 90000)}`,
      };
      state.orders.unshift(newOrder);
    },
    cancelOrder: (state, action: PayloadAction<string>) => {
      const order = state.orders.find(o => o.id === action.payload);
      if (order && order.status !== 'Delivered') {
        order.status = 'Cancelled';
      }
    },
  },
});

export const { setOrders, addOrder, cancelOrder } = ordersSlice.actions;

export default ordersSlice.reducer;
