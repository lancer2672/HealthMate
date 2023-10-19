import {DefaultTheme} from 'react-native-paper';

const darkTheme = {
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

const lightTheme = {
  ...DefaultTheme,
  dark: false,
  mode: 'adaptive',
  roundness: 15,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2176FF',
    accent: '#33A1FD',
    surface: '#FFFFFF',
    background: '#FFFFFF',
    text: '#000000',
  },
};

export {darkTheme, lightTheme};
