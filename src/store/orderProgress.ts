import {
  createListenerMiddleware,
  type ListenerEffectAPI,
} from '@reduxjs/toolkit';
import type { RootState, AppDispatch } from './store';
import {
  addOrder,
  hydrateOrders,
  updateOrderStatus,
  PACKED_AT_MS,
  OUT_FOR_DELIVERY_AT_MS,
  DELIVERED_AT_MS,
} from './slices/ordersSlice';

export const orderProgressMiddleware = createListenerMiddleware();

type Api = ListenerEffectAPI<RootState, AppDispatch>;

// Walks one order through its remaining stages. Every wait is measured from
// placedAt rather than from "now", so an order restored from storage picks up
// exactly where it should be instead of restarting its timeline.
function scheduleOrder(id: string, placedAt: number, api: Api) {
  const statusOf = () =>
    (api.getState() as RootState).orders.orders.find(o => o.id === id)?.status;

  // autoJoin is essential: without it RTK aborts the fork the moment the parent
  // effect returns, so every timer would be cancelled before it could fire.
  api.fork(async forkApi => {
    const waitUntil = async (offsetMs: number) => {
      const remaining = placedAt + offsetMs - Date.now();
      if (remaining > 0) {
        await forkApi.delay(remaining);
      }
    };

    try {
      await waitUntil(PACKED_AT_MS);
      if (statusOf() === 'PLACED') {
        api.dispatch(updateOrderStatus({ id, status: 'PACKED' }));
      }

      await waitUntil(OUT_FOR_DELIVERY_AT_MS);
      if (statusOf() === 'PACKED') {
        api.dispatch(updateOrderStatus({ id, status: 'OUT_FOR_DELIVERY' }));
      }

      await waitUntil(DELIVERED_AT_MS);
      if (statusOf() === 'OUT_FOR_DELIVERY') {
        api.dispatch(updateOrderStatus({ id, status: 'DELIVERED' }));
      }
    } catch {
      // Cancelled (the fork was torn down) — nothing to clean up.
    }
  }, { autoJoin: true });
}

// A freshly placed order.
orderProgressMiddleware.startListening({
  actionCreator: addOrder,
  effect: async (_action, listenerApi) => {
    const newest = (listenerApi.getState() as RootState).orders.orders[0];
    if (newest?.placedAt) {
      scheduleOrder(newest.id, newest.placedAt, listenerApi as Api);
    }
  },
});

// Orders restored from storage. hydrateOrders has already corrected each status
// from elapsed time; this only re-arms whatever is genuinely still in flight.
orderProgressMiddleware.startListening({
  actionCreator: hydrateOrders,
  effect: async (_action, listenerApi) => {
    const { orders } = (listenerApi.getState() as RootState).orders;
    orders
      .filter(
        o =>
          o.placedAt &&
          o.status !== 'DELIVERED' &&
          o.status !== 'CANCELLED',
      )
      .forEach(o => scheduleOrder(o.id, o.placedAt, listenerApi as Api));
  },
});
