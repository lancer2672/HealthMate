import {Provider} from 'react-redux';
import FlashMessage from 'react-native-flash-message';
import Navigator from './src/navigation';
import store from './src/store';
import ThemeProviderComponent from './src/features/auth/components/ThemeProvider.component';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';

export default function App() {
  const theme = {
    ...DefaultTheme,
    dark: true,
    mode: 'adaptive',
    roundness: 15,
    colors: {
      ...DefaultTheme.colors,
      primary: '#2176FF',
      accent: '#33A1FD',
      surface: '#131A26',
      background: '#131A26',
      text: '#FFFFFF',
    },
  };

  return (
    <ThemeProviderComponent>
      <PaperProvider theme={theme}>
        <Provider store={store}>
          <Navigator />
          <FlashMessage position="top" />
        </Provider>
      </PaperProvider>
    </ThemeProviderComponent>
  );
}
