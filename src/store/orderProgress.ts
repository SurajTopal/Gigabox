import { createListenerMiddleware } from '@reduxjs/toolkit';
import type { RootState } from './store';
import {
  addOrder,
  updateOrderStatus,
  PACKED_AFTER_MS,
  OUT_FOR_DELIVERY_AFTER_MS,
} from './slices/ordersSlice';

export const orderProgressMiddleware = createListenerMiddleware();

// Advances a new order PLACED -> PACKED -> OUT_FOR_DELIVERY on a timer. Lives in
// the store rather than a screen so progress continues wherever the user is.
// DELIVERED is not scheduled here: the map reports it when the bike arrives.
orderProgressMiddleware.startListening({
  actionCreator: addOrder,
  effect: async (_action, listenerApi) => {
    // addOrder unshifts, and the reducer may have generated the id itself.
    const id = (listenerApi.getState() as RootState).orders.orders[0]?.id;
    if (!id) return;

    const statusOf = () =>
      (listenerApi.getState() as RootState).orders.orders.find(o => o.id === id)
        ?.status;

    await listenerApi.delay(PACKED_AFTER_MS);
    if (statusOf() !== 'PLACED') return;
    listenerApi.dispatch(updateOrderStatus({ id, status: 'PACKED' }));

    await listenerApi.delay(OUT_FOR_DELIVERY_AFTER_MS);
    if (statusOf() !== 'PACKED') return;
    listenerApi.dispatch(updateOrderStatus({ id, status: 'OUT_FOR_DELIVERY' }));
  },
});
