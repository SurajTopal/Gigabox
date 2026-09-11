import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import Toast from 'react-native-toast-message';
import RootNavigator from './src/navigation/RootNavigator';
import { store } from './src/store';

function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" />
        <RootNavigator />
        <Toast />
      </SafeAreaProvider>
    </Provider>
  );
}

export default App;
