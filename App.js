import {Provider} from 'react-redux';
import FlashMessage from 'react-native-flash-message';
import Navigator from './src/navigation';
import store from './src/store';
import ThemeProviderComponent from './src/features/auth/components/ThemeProvider.component';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import {darkTheme, lightTheme} from './src/features/theme';

export default function App() {
  return (
    <ThemeProviderComponent>
      <PaperProvider theme={lightTheme}>
        <Provider store={store}>
          <Navigator />
          <FlashMessage position="top" />
        </Provider>
      </PaperProvider>
    </ThemeProviderComponent>
  );
}
