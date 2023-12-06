const darkTheme = {
  primary: '#04a0d7',
  accent: '#00bbfb',
  surface: '#131A26',
  background: '#17354a',
  text: '#FFFFFF',
  secondary: '#f27638',
  success: '#29c478',
  green1: '#5c8973',
  green2: '#5c8973',
  green3: '#5c8973'
};

const lightTheme = {
  primary: '#04a0d7',
  accent: '#00bbfb',
  surface: '#131A26',
  background: '#17354a',
  text: '#000000',
  success: '#29c478',

  green1: '#5c8973',
  green2: '#5c8973',
  green3: '#5c8973',
  secondary: '#f27638'
};

export {darkTheme, lightTheme};

import {ThemeProvider} from 'styled-components/native';
import {createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
      <ThemeContext.Provider value={{isDarkTheme: isDarkTheme, setIsDarkTheme}}>
        {children}
      </ThemeContext.Provider>
    </ThemeProvider>
  );
}
