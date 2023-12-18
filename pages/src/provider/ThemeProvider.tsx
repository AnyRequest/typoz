import { ThemeProvider } from '@emotion/react';
import { PaletteMode, ThemeOptions, createTheme } from '@mui/material';
import {
  blueGrey,
  deepOrange,
  green,
  grey,
  indigo,
} from '@mui/material/colors';
import { ReactElement, createContext, useMemo, useState } from 'react';

export const ColorModeContext = createContext({
  toggleColorMode: () => {},
  change: (_mode: 'dark' | 'light') => {},
  mode: () => {
    return '' as PaletteMode;
  },
  // getLogo: () => {
  //   return '' as string;
  // },
});

const getDesignTokens = (mode: PaletteMode) =>
  ({
    palette: {
      mode,
      ...(mode === 'light'
        ? {
            // palette values for light mode
            primary: green,
            // divider: amber[200],
            text: {
              primary: grey[900],
              secondary: grey[800],
            },
            secondary: {
              main: '#9B111E',
            },
            background: {
              default: '#F8F8F8',
              paper: '#F8F8F8',
            },
          }
        : {
            // palette values for dark mode
            primary: blueGrey,
            divider: deepOrange[700],
            background: {
              default: '#1b1c2e',
              paper: indigo['800'],
            },
            text: {
              primary: '#ffffff',
              secondary: grey[500],
            },
          }),
    },
  } as ThemeOptions);

export default function CustomThemeProvider({
  children,
}: {
  children: ReactElement;
}) {
  const [mode, setMode] = useState<PaletteMode>('light');
  const colorMode = useMemo(
    () => ({
      // The dark mode switch would invoke this method
      toggleColorMode: () => {
        setMode((prevMode: PaletteMode) =>
          prevMode === 'light' ? 'dark' : 'light',
        );
      },
      change(mode: 'dark' | 'light') {
        setMode(mode);
      },
      mode: () => {
        return mode;
      },
      // getLogo() {
      //   return mode === 'dark'
      //     ? BASE_PATH + 'logo/typoz-logo-w-fit.png'
      //     : BASE_PATH + 'logo/typoz-logo-bw-fit.png';
      // },
    }),
    [mode],
  );

  // Update the theme only if the mode changes
  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ColorModeContext.Provider>
  );
}
