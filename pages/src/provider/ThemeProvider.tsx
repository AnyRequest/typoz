import { ThemeProvider } from '@emotion/react';
import { PaletteMode, ThemeOptions, createTheme } from '@mui/material';
import { amber, grey, deepOrange, green, indigo } from '@mui/material/colors';
import { useState, useMemo, ReactElement, createContext } from 'react';

export const ColorModeContext = createContext({
  toggleColorMode: () => {},
  mode: () => {},
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
            primary: indigo,
            divider: deepOrange[700],
            background: {
              default: indigo['800'],
              paper: indigo['800'],
            },
            text: {
              primary: '#fff',
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
      mode: () => {
        return mode;
      },
    }),
    [],
  );

  // Update the theme only if the mode changes
  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ColorModeContext.Provider>
  );
}
