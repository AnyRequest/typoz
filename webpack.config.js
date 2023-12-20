import path from 'path';

export default [
  {
    entry: './src/index.ts',
    output: {
      path: path.resolve(path.resolve(), 'dist/umd'),
      filename: 'typoz.min.js',
      library: 'Typoz',
      libraryTarget: 'umd',
      libraryExport: 'default',
    },
    module: {
      rules: [
        {
          test: /\.js$/, // .js 에 한하여 babel-loader를 이용하여 transpiling
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /\.ts$/, // .ts 에 한하여 ts-loader를 이용하여 transpiling
          exclude: /node_modules/,
          use: {
            loader: 'ts-loader',
          },
        },
      ],
    },
    resolve: {
      alias: {
        '@': path.resolve(path.resolve(), 'src'),
      },
      modules: [path.join(path.resolve(), 'src'), 'node_modules'], // 모듈 위치
      extensions: ['.ts', '.js'],
    },
    mode: 'production',
  },
  {
    entry: './src/index.ts',
    output: {
      path: path.resolve(path.resolve(), 'dist/cjs'),
      filename: 'index.cjs',
      library: {
        type: 'commonjs-static',
      },
    },
    module: {
      rules: [
        {
          test: /\.js$/, // .js 에 한하여 babel-loader를 이용하여 transpiling
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /\.ts$/, // .ts 에 한하여 ts-loader를 이용하여 transpiling
          exclude: /node_modules/,
          use: {
            loader: 'ts-loader',
          },
        },
      ],
    },
    resolve: {
      alias: {
        '@': path.resolve(path.resolve(), 'src'),
      },
      modules: [path.join(path.resolve(), 'src'), 'node_modules'], // 모듈 위치
      extensions: ['.ts', '.js'],
    },
    mode: 'production',
  },
];
