import * as eva from '@eva-design/eva';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ApplicationProvider} from '@ui-kitten/components';
import {useEffect, useState} from 'react';
import FlashMessage from 'react-native-flash-message';
import 'react-native-gesture-handler';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import {ToastProvider} from 'react-native-toast-notifications';
import {Provider} from 'react-redux';
import OnboardComponent from 'src/features/onboard/Onboard.screen';
import ThemeProviderComponent from './src/features/theme';
import Navigator from './src/navigation';
import store from './src/store';

const SEEN_ONBOARD = 'hasSeenOnboard';
export default function App() {
  const [hasSeenOnboard, setHasSeenOnboard] = useState(false);

  const handleOnboardDone = async () => {
    await AsyncStorage.setItem(SEEN_ONBOARD, 'true');
    setHasSeenOnboard(true);
  };

  useEffect(() => {
    (async () => {
      const userHasSeenOnboard = await AsyncStorage.getItem(SEEN_ONBOARD);
      setHasSeenOnboard(userHasSeenOnboard);
    })();
  }, []);

  return !hasSeenOnboard ? (
    <OnboardComponent onDone={handleOnboardDone} />
  ) : (
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
