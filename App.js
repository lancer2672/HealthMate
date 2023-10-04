import {Provider} from 'react-redux';
import FlashMessage from 'react-native-flash-message';

import Navigator from './src/navigation';
import store from './src/store';
import ThemeProviderComponent from './src/features/auth/components/ThemeProvider.component';

export default function App() {
  return (
    <ThemeProviderComponent>
      <Provider store={store}>
        <Navigator />
        <FlashMessage position="top" />
      </Provider>
    </ThemeProviderComponent>
  );
}
