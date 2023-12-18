import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import CustomThemeProvider from './provider/ThemeProvider.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    {/* <React.StrictMode></React.StrictMode> */}
    <BrowserRouter>
      <CustomThemeProvider>
        <App />
      </CustomThemeProvider>
    </BrowserRouter>
  </>,
);
