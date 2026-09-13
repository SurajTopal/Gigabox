import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type OrderStatus =
  | 'PLACED'
  | 'PACKED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

// Values stay underscore-free of spaces so they can be used directly as style
// keys; anything user-facing goes through this map instead.
export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  PLACED: 'Placed',
  PACKED: 'Packed',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

export const PACKED_AFTER_MS = 30000;
export const OUT_FOR_DELIVERY_AFTER_MS = 15000;

export interface Order {
  id: string;
  date: string;
  itemsCount: number;
  subtotal: number;
  deliveryCharges: number;
  totalAmount: number;
  status: OrderStatus;
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
      subtotal: 1499,
      deliveryCharges: 0,
      totalAmount: 1499,
      status: 'DELIVERED',
    },
    {
      id: 'GB-97810',
      date: 'Sep 02, 2026',
      itemsCount: 1,
      subtotal: 499,
      deliveryCharges: 0,
      totalAmount: 499,
      status: 'DELIVERED',
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
      if (order && order.status !== 'DELIVERED') {
        order.status = 'CANCELLED';
      }
    },
    updateOrderStatus: (
      state,
      action: PayloadAction<{ id: string; status: OrderStatus }>,
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
