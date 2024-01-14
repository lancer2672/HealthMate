import * as eva from '@eva-design/eva';
import {ApplicationProvider} from '@ui-kitten/components';
import FlashMessage from 'react-native-flash-message';
import 'react-native-gesture-handler';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import {ToastProvider} from 'react-native-toast-notifications';
import {Provider} from 'react-redux';
import ThemeProviderComponent from './src/features/theme';
import Navigator from './src/navigation';
import store from './src/store';

export default function App() {
  return (
    <ApplicationProvider {...eva} theme={eva.light}>
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
    </ApplicationProvider>
  );
}
