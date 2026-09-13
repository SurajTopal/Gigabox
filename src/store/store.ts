import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import cartReducer from './slices/cartSlice';
import ordersReducer from './slices/ordersSlice';
import productReducer from './slices/productSlice';
import { orderProgressMiddleware } from './orderProgress';
import { userPersistenceMiddleware } from './userPersistence';
import { orderPersistenceMiddleware } from './orderPersistence';
import { orderNotificationsMiddleware } from './orderNotifications';

export const store = configureStore({
  reducer: {
    user: userReducer,
    cart: cartReducer,
    orders: ordersReducer,
    products: productReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().prepend(
      orderProgressMiddleware.middleware,
      userPersistenceMiddleware.middleware,
      orderPersistenceMiddleware.middleware,
      orderNotificationsMiddleware.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
