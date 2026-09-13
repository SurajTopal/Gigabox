import AsyncStorage from '@react-native-async-storage/async-storage';
import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import type { RootState } from './store';
import {
  addOrder,
  updateOrderStatus,
  cancelOrder,
  hydrateOrders,
  Order,
} from './slices/ordersSlice';

const ORDERS_KEY = 'gigabox:orders';

export const orderPersistenceMiddleware = createListenerMiddleware();

orderPersistenceMiddleware.startListening({
  matcher: isAnyOf(addOrder, updateOrderStatus, cancelOrder, hydrateOrders),
  effect: async (_action, listenerApi) => {
    const { orders } = (listenerApi.getState() as RootState).orders;
    try {
      await AsyncStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    } catch (e) {
      console.warn('Could not save orders', e);
    }
  },
});

export async function loadStoredOrders(): Promise<Order[] | null> {
  try {
    const raw = await AsyncStorage.getItem(ORDERS_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return Array.isArray(parsed) ? parsed : null;
  } catch (e) {
    console.warn('Could not read saved orders', e);
    return null;
  }
}
