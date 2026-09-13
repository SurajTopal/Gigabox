import { useEffect, useState } from 'react';
import { StatusBar, View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import Toast from 'react-native-toast-message';
import RootNavigator from './src/navigation/RootNavigator';
import { store } from './src/store';
import { hydrateUser } from './src/store/slices/userSlice';
import { loadStoredProfile } from './src/store/userPersistence';
import { hydrateOrders } from './src/store/slices/ordersSlice';
import { loadStoredOrders } from './src/store/orderPersistence';
import { initNotifications } from './src/services/notifications';

function App() {
  // Held back until the saved profile is applied, so the UI never renders the
  // default profile and then swap it out.
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Asks for notification permission and creates the channel. Not awaited with
    // the rest — the app shouldn't be held behind a permission dialog.
    initNotifications();

    Promise.all([loadStoredProfile(), loadStoredOrders()])
      .then(([profile, orders]) => {
        if (profile) {
          store.dispatch(hydrateUser(profile));
        }
        // Recomputes each status from elapsed time and re-arms whatever is still
        // in flight, so orders that advanced while the app was closed are correct.
        if (orders) {
          store.dispatch(hydrateOrders(orders));
        }
      })
      .finally(() => setHydrated(true));
  }, []);

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" />
        {hydrated ? (
          <RootNavigator />
        ) : (
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <ActivityIndicator size="large" />
          </View>
        )}
        <Toast />
      </SafeAreaProvider>
    </Provider>
  );
}

export default App;
