import react from '@vitejs/plugin-react-swc';
import path from 'path';
import dotenv from 'dotenv';

// https://vitejs.dev/config/
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  dotenv.config({
    path: path.join(path.resolve(), '.env'),
  });

  const HOST = process.env.HOST;
  const PORT = +(process.env.PORT || 5000);
  return {
    // vite config
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
      'process.env': {
        BRAND_NAME: process.env.BRAND_NAME,
        AUTHOR: process.env.AUTHOR,
        COPYRIGHT: process.env.COPYRIGHT,
        VERSION: process.env.VERSION,
      },
    },
    base: process.env.NODE_ENV === 'development' ? '/' : '/typoz/',
    server: {
      host: HOST,
      port: PORT,
    },
    build: {
      minify: 'terser',
      cssMinify: true,
      terserOptions: {
        keep_classnames: true,
      },
    },
    plugins: [react()],
  };
});
