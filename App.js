import {Provider} from 'react-redux';
import FlashMessage from 'react-native-flash-message';
import 'react-native-gesture-handler';
import Navigator from './src/navigation';
import store from './src/store';
import ThemeProviderComponent from './src/features/theme';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import {ToastProvider} from 'react-native-toast-notifications';
export default function App() {
  return (
    <ThemeProviderComponent>
      <ToastProvider>
        <PaperProvider theme={DefaultTheme}>
          <Provider store={store}>
            <Navigator />
            <FlashMessage position="top" />
          </Provider>
        </PaperProvider>
      </ToastProvider>
    </ThemeProviderComponent>
  );
}
