import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import CustomThemeProvider from './provider/ThemeProvider.tsx';
import { CssBaseline, GlobalStyles } from '@mui/material';
import './assets/style/main.scss';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-javascript.min';
import 'prismjs/components/prism-typescript.min';
import 'prismjs/components/prism-jsx.min';
import 'prismjs/components/prism-tsx.min';
import 'prismjs/components/prism-bash.min';
import 'prismjs/plugins/line-numbers/prism-line-numbers';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
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
