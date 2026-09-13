import { createListenerMiddleware } from '@reduxjs/toolkit';
import type { RootState } from './store';
import { addOrder, cancelOrder } from './slices/ordersSlice';
import {
  scheduleOrderNotifications,
  cancelOrderNotifications,
} from '../services/notifications';

export const orderNotificationsMiddleware = createListenerMiddleware();

// Scheduled once, when the order is placed. Android owns the alarms from then
// on, so they still fire with the app closed — nothing here needs to re-run.
orderNotificationsMiddleware.startListening({
  actionCreator: addOrder,
  effect: async (_action, listenerApi) => {
    const newest = (listenerApi.getState() as RootState).orders.orders[0];
    if (newest?.placedAt) {
      await scheduleOrderNotifications(newest.id, newest.placedAt);
    }
  },
});

orderNotificationsMiddleware.startListening({
  actionCreator: cancelOrder,
  effect: async (action) => {
    await cancelOrderNotifications(action.payload);
  },
});
