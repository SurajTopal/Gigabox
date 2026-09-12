import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Order {
  id: string;
  date: string;
  itemsCount: number;
  totalAmount: number;
  status: 'Delivered' | 'In Transit' | 'Cancelled' | 'Processing';
  items?: any[];
  customer?: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
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
    addOrder: (state, action: PayloadAction<Order | Omit<Order, 'id'>>) => {
      let newOrder: Order;
      if ('id' in action.payload && action.payload.id) {
        newOrder = action.payload as Order;
      } else {
        newOrder = {
          ...action.payload,
          id: `GB-${Math.floor(10000 + Math.random() * 90000)}`,
        } as Order;
      }
      state.orders.unshift(newOrder);
    },
    cancelOrder: (state, action: PayloadAction<string>) => {
      const order = state.orders.find(o => o.id === action.payload);
      if (order && order.status !== 'Delivered') {
        order.status = 'Cancelled';
      }
    },
    updateOrderStatus: (
      state,
      action: PayloadAction<{ id: string; status: Order['status'] }>,
    ) => {
      const order = state.orders.find(o => o.id === action.payload.id);
      if (order) {
        order.status = action.payload.status;
      }
    },
  },
});

export const { setOrders, addOrder, cancelOrder, updateOrderStatus } =
  ordersSlice.actions;

export default ordersSlice.reducer;
