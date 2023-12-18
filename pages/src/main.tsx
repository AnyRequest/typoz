import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import CustomThemeProvider from './provider/ThemeProvider.tsx';
import { CssBaseline, GlobalStyles } from '@mui/material';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    {/* <React.StrictMode></React.StrictMode> */}
    <GlobalStyles
      styles={`
      html {
      }
      html, body {
        margin: 0;
        height: 100vh;
        overflow: hidden;
      }
      body{
        overflow:auto;
      }
    `}
    />
    <CssBaseline />
    <BrowserRouter>
      <CustomThemeProvider>
        <App />
      </CustomThemeProvider>
    </BrowserRouter>
  </>,
);
