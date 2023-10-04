import {ThemeProvider} from 'styled-components/native';
import {createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {theme} from '../../../utils/theme';
export const ThemeContext = createContext();

export default function ThemeProviderComponent({children}) {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    (async () => {
      const isUseDarkTheme = await AsyncStorage.getItem('AppTheme');

      if (isUseDarkTheme == 'dark') {
        setIsDarkTheme(true);
      }
    })();
  }, []);

  return (
    <ThemeProvider theme={isDarkTheme ? darkTheme : theme}>
      <ThemeContext.Provider value={{isDarkTheme: isDarkTheme, setIsDarkTheme}}>
        {children}
      </ThemeContext.Provider>
    </ThemeProvider>
  );
}
