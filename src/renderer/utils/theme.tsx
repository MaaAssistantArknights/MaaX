import { useEffect, useState } from 'react';
import {
  ThemeProvider,
  ThemeProviderProps,
  createTheme,
} from '@fluentui/react/lib/Theme';

const lightTheme = createTheme({
  palette: {
    themePrimary: '#64619a',
    themeLighterAlt: '#f7f7fb',
    themeLighter: '#e1e1ef',
    themeLight: '#c9c7e0',
    themeTertiary: '#9997c2',
    themeSecondary: '#726fa5',
    themeDarkAlt: '#59578a',
    themeDark: '#4b4974',
    themeDarker: '#383656',
    neutralLighterAlt: '#eeeeee',
    neutralLighter: '#eaeaea',
    neutralLight: '#e1e1e1',
    neutralQuaternaryAlt: '#d1d1d1',
    neutralQuaternary: '#c8c8c8',
    neutralTertiaryAlt: '#c0c0c0',
    neutralTertiary: '#595959',
    neutralSecondary: '#373737',
    neutralPrimaryAlt: '#2f2f2f',
    neutralPrimary: '#000000',
    neutralDark: '#151515',
    black: '#0b0b0b',
    white: '#f4f4f4',
  },
});

const darkTheme = createTheme({
  palette: {
    themePrimary: '#daf1e1',
    themeLighterAlt: '#c2d8c9',
    themeLighter: '#aabdb0',
    themeLight: '#92a297',
    themeTertiary: '#7a887e',
    themeSecondary: '#626d65',
    themeDarkAlt: '#4a524d',
    themeDark: '#323834',
    themeDarker: '#1a1d1b',
    neutralLighterAlt: '#0a0a0a',
    neutralLighter: '#0a0a0a',
    neutralLight: '#090909',
    neutralQuaternaryAlt: '#090909',
    neutralQuaternary: '#080808',
    neutralTertiaryAlt: '#080808',
    neutralTertiary: '#c8c8c8',
    neutralSecondary: '#d0d0d0',
    neutralPrimaryAlt: '#dadada',
    neutralPrimary: '#ffffff',
    neutralDark: '#f4f4f4',
    black: '#f8f8f8',
    white: '#0a0a0a',
  },
});

const themeQuery = () =>
  window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');

const getBrowserTheme = () => {
  const query = themeQuery();
  return query && query.matches ? 'dark' : 'light';
};

const onBrowserThemeChanged = (callback: (theme: string) => void) => {
  const query = themeQuery();
  if (query) {
    query.addEventListener('change', () => {
      callback(query.matches ? 'dark' : 'light');
    });
  }
};

const useBrowserTheme = ({ children, ...props }: ThemeProviderProps) => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    if (theme === '') {
      setTheme(getBrowserTheme());
    }
    return onBrowserThemeChanged(setTheme);
  }, [theme, setTheme]);

  return (
    <ThemeProvider
      theme={theme === 'light' ? lightTheme : darkTheme}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    >
      {children}
    </ThemeProvider>
  );
};

export default useBrowserTheme;
