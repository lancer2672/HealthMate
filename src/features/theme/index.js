const darkTheme = {
  primary: '#04a0d7',
  accent: '#00bbfb',
  surface: '#131A26',
  background: '#131A26',
  text: '#FFFFFF',
  waterTracking: {
    primary: '#04a0d7',
    secondary: '#00bbfb',
  },
};

const lightTheme = {
  primary: '#04a0d7',
  accent: '#00bbfb',
  surface: '#FFFFFF',
  background: '#FFFFFF',
  text: '#000000',
  waterTracking: {
    primary: '#04a0d7',
    secondary: '#00bbfb',
    background: '#17354a',
  },
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
