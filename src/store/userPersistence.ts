import AsyncStorage from '@react-native-async-storage/async-storage';
import { createListenerMiddleware } from '@reduxjs/toolkit';
import type { RootState } from './store';
import { setUserProfile } from './slices/userSlice';

const STORAGE_KEY = 'gigabox:user-profile';

export const userPersistenceMiddleware = createListenerMiddleware();

// Saves the profile whenever it is edited. Only the flat fields are stored —
// `addresses` is unused, and persisting it would freeze today's shape on disk.
userPersistenceMiddleware.startListening({
  actionCreator: setUserProfile,
  effect: async (_action, listenerApi) => {
    const { name, email, phone, address } = (listenerApi.getState() as RootState)
      .user;

    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ name, email, phone, address }),
      );
    } catch (e) {
      console.warn('Could not save profile', e);
    }
  },
});

export async function loadStoredProfile() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.warn('Could not read saved profile', e);
    return null;
  }
}
