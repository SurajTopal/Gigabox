import { useEffect, useState } from 'react';
import { StatusBar, View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import Toast from 'react-native-toast-message';
import RootNavigator from './src/navigation/RootNavigator';
import { store } from './src/store';
import { hydrateUser } from './src/store/slices/userSlice';
import { loadStoredProfile } from './src/store/userPersistence';

function App() {
  // Held back until the saved profile is applied, so the UI never renders the
  // default profile and then swap it out.
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    loadStoredProfile()
      .then(saved => {
        if (saved) {
          store.dispatch(hydrateUser(saved));
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
